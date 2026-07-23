import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedRoles = new Set(["admin", "member", "viewer"]);

function response(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": origin,
      "access-control-allow-headers": "authorization, content-type, x-client-info",
      "access-control-allow-methods": "POST, OPTIONS",
      "vary": "origin",
    },
  });
}

Deno.serve(async (request) => {
  const appUrl = Deno.env.get("APP_URL")?.replace(/\/+$/, "") ?? "";
  const origin = request.headers.get("origin") ?? "";
  if (!appUrl || origin !== appUrl) return response({ error: "Origin is not allowed." }, 403, appUrl);
  if (request.method === "OPTIONS") return response({}, 204, origin);
  if (request.method !== "POST" || !request.headers.get("content-type")?.includes("application/json")) {
    return response({ error: "Unsupported request." }, 415, origin);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authorization = request.headers.get("authorization") ?? "";
    const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { authorization } } });
    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) return response({ error: "Authentication required." }, 401, origin);

    const payload = await request.json() as { organizationId?: string; email?: string; role?: string };
    const organizationId = payload.organizationId?.trim();
    const email = payload.email?.trim().toLowerCase();
    const role = payload.role?.trim().toLowerCase() ?? "member";
    if (!organizationId || !email || !/^\S+@\S+\.\S+$/.test(email) || !allowedRoles.has(role)) {
      return response({ error: "Invalid invitation details." }, 400, origin);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: membership } = await admin.from("organization_members").select("role").eq("organization_id", organizationId).eq("user_id", user.id).eq("status", "active").maybeSingle();
    if (!membership || !["owner", "admin"].includes(membership.role)) return response({ error: "Administrator access required." }, 403, origin);

    const { data: invitation, error: inviteRowError } = await admin.from("organization_invitations").upsert({
      organization_id: organizationId,
      email,
      role,
      status: "pending",
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id,email", ignoreDuplicates: false }).select("id").single();
    if (inviteRowError) throw inviteRowError;

    const { error: mailError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${appUrl}/auth/callback?invite=${invitation.id}`,
      data: { organization_id: organizationId, organization_role: role, invitation_id: invitation.id },
    });
    if (mailError) throw mailError;

    await admin.from("audit_events").insert({
      organization_id: organizationId,
      actor_user_id: user.id,
      event_type: "member.invited",
      target_type: "invitation",
      target_id: invitation.id,
      metadata: { role },
    });
    return response({ ok: true, invitationId: invitation.id }, 200, origin);
  } catch {
    return response({ error: "The invitation could not be sent. Try again later." }, 500, origin);
  }
});
