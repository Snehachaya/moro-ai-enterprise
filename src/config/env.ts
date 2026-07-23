function required(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
  const value = import.meta.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export const env = {
  supabaseUrl: normalizeUrl(required("VITE_SUPABASE_URL")),
  supabaseAnonKey: required("VITE_SUPABASE_ANON_KEY"),
  appUrl: normalizeUrl(import.meta.env.VITE_APP_URL?.trim() || window.location.origin),
} as const;

