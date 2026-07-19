create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.organizations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'MoroAI Shared Workspace')
on conflict (id) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  role text not null default 'Member',
  workspace text not null default 'MoroAI Shared Workspace',
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null check (module_id in ('object-detection', 'accident-detection')),
  trial_ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table if not exists public.registered_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade default '00000000-0000-0000-0000-000000000001',
  created_by uuid not null references auth.users(id) on delete restrict,
  category text not null check (category in ('asset', 'person')),
  name text not null,
  identity_id text not null,
  object_type text not null,
  image_paths text[] not null default '{}',
  embeddings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, identity_id)
);

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_organization_id and user_id = auth.uid()
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''))
  on conflict (id) do nothing;
  insert into public.organization_members (organization_id, user_id)
  values ('00000000-0000-0000-0000-000000000001', new.id)
  on conflict do nothing;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created after insert on auth.users
    for each row execute procedure public.handle_new_user();
  end if;
end $$;

insert into public.profiles (id, full_name, email)
select id, coalesce(raw_user_meta_data ->> 'full_name', ''), coalesce(email, '') from auth.users
on conflict (id) do nothing;
insert into public.organization_members (organization_id, user_id)
select '00000000-0000-0000-0000-000000000001', id from auth.users
on conflict do nothing;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.registered_entities enable row level security;

create policy "members view organizations" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "users view own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "members view memberships" on public.organization_members for select to authenticated using (public.is_org_member(organization_id));
create policy "users manage own subscriptions" on public.subscriptions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "members view shared entities" on public.registered_entities for select to authenticated using (public.is_org_member(organization_id));
create policy "members create shared entities" on public.registered_entities for insert to authenticated with check (created_by = auth.uid() and public.is_org_member(organization_id));
create policy "members update shared entities" on public.registered_entities for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "members delete shared entities" on public.registered_entities for delete to authenticated using (public.is_org_member(organization_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('entity-images', 'entity-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "members read entity images" on storage.objects for select to authenticated
using (bucket_id = 'entity-images' and public.is_org_member((storage.foldername(name))[1]::uuid));
create policy "members upload entity images" on storage.objects for insert to authenticated
with check (bucket_id = 'entity-images' and public.is_org_member((storage.foldername(name))[1]::uuid));
create policy "members update entity images" on storage.objects for update to authenticated
using (bucket_id = 'entity-images' and public.is_org_member((storage.foldername(name))[1]::uuid));
create policy "members delete entity images" on storage.objects for delete to authenticated
using (bucket_id = 'entity-images' and public.is_org_member((storage.foldername(name))[1]::uuid));
