import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";

export interface AuthUser { id: string; name: string; email: string; }
export interface UserProfile { fullName: string; email: string; phone: string; role: string; workspace: string; }

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (name: string, organizationName: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

let authListenerReady = false;

function mapUser(user: User): AuthUser {
  const fallback = user.email?.split("@")[0] || "MoroAI User";
  return { id: user.id, email: user.email ?? "", name: String(user.user_metadata.full_name || fallback) };
}

async function loadProfile(user: User) {
  const { data } = await supabase.from("profiles").select("full_name,email,phone,role,workspace").eq("id", user.id).maybeSingle();
  return data ? { fullName: data.full_name, email: data.email, phone: data.phone, role: data.role, workspace: data.workspace } : {
    fullName: mapUser(user).name, email: user.email ?? "", phone: "", role: "Member", workspace: "MoroAI Shared Workspace",
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  initialize: async () => {
    try {
      const sessionOnly = sessionStorage.getItem("moro-ai-session-only") === "true";
      const remembered = localStorage.getItem("moro-ai-remember") === "true";
      if (!sessionOnly && !remembered) await authService.signOut("local");
      const { data: { session }, error: sessionError } = await authService.getSession();
      if (sessionError) throw sessionError;
      if (session) {
        const { data: { user }, error: userError } = await authService.getUser();
        if (userError || !user) throw userError ?? new Error("Session validation failed.");
        set({ user: mapUser(user), profile: await loadProfile(user), isAuthenticated: true, isLoading: false });
      } else set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
    if (!authListenerReady) {
      authListenerReady = true;
      authService.onAuthStateChange((_event, nextSession) => {
        if (!nextSession?.user) { set({ user: null, profile: null, isAuthenticated: false, isLoading: false }); return; }
        const nextUser = nextSession.user;
        set({ user: mapUser(nextUser), isAuthenticated: true, isLoading: false });
        window.setTimeout(() => void loadProfile(nextUser).then((profile) => set({ profile })), 0);
      });
    }
  },
  login: async (email, password, remember) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;
    if (data.user && !data.user.email_confirmed_at) {
      await authService.signOut("local");
      throw new Error("Confirm your email address before signing in.");
    }
    if (remember) {
      localStorage.setItem("moro-ai-remember", "true");
      sessionStorage.removeItem("moro-ai-session-only");
    } else {
      localStorage.removeItem("moro-ai-remember");
      sessionStorage.setItem("moro-ai-session-only", "true");
    }
    if (data.user) set({ user: mapUser(data.user), profile: await loadProfile(data.user), isAuthenticated: true, isLoading: false });
  },
  register: async (name, organizationName, email, password) => {
    const { data, error } = await authService.signUp(name, organizationName, email, password);
    if (error) throw error;
    if (data.session && data.user) set({ user: mapUser(data.user), profile: await loadProfile(data.user), isAuthenticated: true, isLoading: false });
    return { needsEmailConfirmation: !data.session };
  },
  updateProfile: async (profile) => {
    const userId = get().user?.id;
    if (!userId) throw new Error("Sign in to update your profile.");
    const current = get().profile;
    if (current?.email && profile.email !== current.email) {
      const { error: emailError } = await authService.updateEmail(profile.email);
      if (emailError) throw emailError;
    }
    const safeProfile = {
      ...profile,
      role: current?.role || "Member",
      workspace: current?.workspace || "MoroAI Workspace",
    };
    const { error } = await supabase.from("profiles").update({ full_name: safeProfile.fullName, email: safeProfile.email, phone: safeProfile.phone, updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) throw error;
    set({ profile: safeProfile, user: { id: userId, name: safeProfile.fullName, email: safeProfile.email } });
  },
  logout: async () => {
    localStorage.removeItem("moro-ai-remember");
    sessionStorage.removeItem("moro-ai-session-only");
    await authService.signOut("local");
    set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
  },
}));
