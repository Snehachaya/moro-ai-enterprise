import { supabase } from "@/lib/supabase";

export type OrganizationRole = "owner" | "admin" | "member" | "viewer";

export async function getCurrentOrganization() {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id,role,organizations(id,name)")
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No active organization is assigned to this account.");
  return {
    id: data.organization_id as string,
    role: data.role as OrganizationRole,
    organization: data.organizations,
  };
}

