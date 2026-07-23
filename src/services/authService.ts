import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { supabase } from "@/lib/supabase";

const callbackUrl = `${env.appUrl}/auth/callback`;
const resetUrl = `${env.appUrl}/auth/reset-password`;

export const authService = {
  getSession: () => supabase.auth.getSession(),
  getUser: () => supabase.auth.getUser(),
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(callback),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password }),
  signUp: (fullName: string, organizationName: string, email: string, password: string) =>
    supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim(), organization_name: organizationName.trim() },
        emailRedirectTo: callbackUrl,
      },
    }),
  resendSignupVerification: (email: string) =>
    supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: callbackUrl },
    }),
  requestPasswordReset: (email: string) =>
    supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: resetUrl }),
  updatePassword: (password: string) => supabase.auth.updateUser({ password }),
  updateEmail: (email: string) =>
    supabase.auth.updateUser({ email: email.trim().toLowerCase() }, { emailRedirectTo: callbackUrl }),
  exchangeCode: (code: string) => supabase.auth.exchangeCodeForSession(code),
  refreshSession: () => supabase.auth.refreshSession(),
  signOut: (scope: "local" | "global" = "local") => supabase.auth.signOut({ scope }),
};

