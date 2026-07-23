import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storageKey: "moro-ai-auth",
  },
  global: { headers: { "X-Client-Info": "moro-ai-enterprise-web" } },
});

export const SHARED_ORGANIZATION_ID = "00000000-0000-0000-0000-000000000001";
