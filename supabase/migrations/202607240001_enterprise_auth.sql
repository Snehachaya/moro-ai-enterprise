-- Production multi-tenant auth and authorization hardening.
-- Apply after 202607200001_shared_backend.sql.

create extension if not exists citext;

do $$ begin
  create type public.app_role as enum ('owner', 'admin', 'member', 'viewer');
exception when duplicate_object then null; end $$;

alter table public.organizations
  add column if not exists slug citext,
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists organizations_slug_key on public.organizations(slug) where slug is not null;

alter table public.organization_members
  add column if not exists status text not null default 'active',
  add column if not exists invited_by uuid references auth.users(id),
  add column if not exists joined_at timestamptz not null default now();

alter table public.registered_entities
  add column if not exists updated_by uuid references auth.users(id),
  add column if not exists deleted_at timestamptz;

create table if not exists public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email citext not null,
  role public.app_role not null default 'member',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references auth.users(id),
  accepted_by uuid references auth.users(id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists one_pending_invite_per_org_email
  on public.organization_invitations(organization_id, email) where status = 'pending';

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_org_created_idx on public.audit_events(organization_id, created_at desc);

create or replace function public.current_org_role(target_organization_id uuid)
returns text language sql stable security definer set search_path = public
as $$
  select role from public.organization_members
  where organization_id = target_organization_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

create or replace function public.has_org_role(target_organization_id uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$
  select coalesce(public.current_org_role(target_organization_id) = any(allowed_roles), false);
$$;

revoke all on function public.current_org_role(uuid) from public;
revoke all on function public.has_org_role(uuid, text[]) from public;
grant execute on function public.current_org_role(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  new_organization_id uuid := gen_random_uuid();
  organization_name text := nullif(trim(new.raw_user_meta_data ->> 'organization_name'), '');
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''))
  on conflict (id) do nothing;

  if organization_name is not null then
    insert into public.organizations (id, name, slug, created_by)
    values (
      new_organization_id,
      organization_name,
      lower(regexp_replace(organization_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(new_organization_id::text, 8),
      new.id
    );
    insert into public.organization_members (organization_id, user_id, role, status)
    values (new_organization_id, new.id, 'owner', 'active');
  end if;
  return new;
end;
$$;

create or replace function public.start_module_trial(requested_module_id text)
returns timestamptz language plpgsql security definer set search_path = public
as $$
declare
  trial_end timestamptz;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if requested_module_id not in ('object-detection', 'accident-detection') then raise exception 'Unsupported module'; end if;

  select trial_ends_at into trial_end from public.subscriptions
  where user_id = auth.uid() and module_id = requested_module_id;

  if trial_end is not null then return trial_end; end if;
  trial_end := now() + interval '30 days';
  insert into public.subscriptions(user_id, module_id, trial_ends_at)
  values(auth.uid(), requested_module_id, trial_end);
  return trial_end;
end;
$$;
revoke all on function public.start_module_trial(text) from public;
grant execute on function public.start_module_trial(text) to authenticated;

alter table public.organization_invitations enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "users manage own subscriptions" on public.subscriptions;
create policy "users view own subscriptions" on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "members create shared entities" on public.registered_entities;
drop policy if exists "members update shared entities" on public.registered_entities;
drop policy if exists "members delete shared entities" on public.registered_entities;
create policy "members create organization entities" on public.registered_entities
  for insert to authenticated with check (
    created_by = auth.uid()
    and updated_by = auth.uid()
    and public.has_org_role(organization_id, array['owner','admin','member'])
  );
create policy "authorized users update organization entities" on public.registered_entities
  for update to authenticated using (
    created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin'])
  ) with check (
    public.has_org_role(organization_id, array['owner','admin','member'])
  );

create or replace function public.protect_entity_tenant_fields()
returns trigger language plpgsql set search_path = public
as $$
begin
  if new.organization_id <> old.organization_id or new.created_by <> old.created_by then
    raise exception 'Entity ownership fields cannot be changed';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_entity_tenant_fields on public.registered_entities;
create trigger protect_entity_tenant_fields before update on public.registered_entities
for each row execute function public.protect_entity_tenant_fields();

create policy "admins view invitations" on public.organization_invitations
  for select to authenticated using (public.has_org_role(organization_id, array['owner','admin']));
create policy "admins view audit events" on public.audit_events
  for select to authenticated using (public.has_org_role(organization_id, array['owner','admin']));

create index if not exists organization_members_user_status_idx on public.organization_members(user_id, status);
create index if not exists registered_entities_org_active_idx on public.registered_entities(organization_id, created_at desc) where deleted_at is null;
