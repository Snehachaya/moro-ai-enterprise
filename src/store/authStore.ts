import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface AuthUser { id: string; name: string; email: string; }
export interface UserProfile { fullName: string; email: string; phone: string; role: string; workspace: string; }

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) set({ user: mapUser(session.user), profile: await loadProfile(session.user), isAuthenticated: true, isLoading: false });
    else set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    if (!authListenerReady) {
      authListenerReady = true;
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!nextSession?.user) { set({ user: null, profile: null, isAuthenticated: false, isLoading: false }); return; }
        const nextUser = nextSession.user;
        set({ user: mapUser(nextUser), isAuthenticated: true, isLoading: false });
        window.setTimeout(() => void loadProfile(nextUser).then((profile) => set({ profile })), 0);
      });
    }
  },
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) set({ user: mapUser(data.user), profile: await loadProfile(data.user), isAuthenticated: true, isLoading: false });
  },
  register: async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/login` } });
    if (error) throw error;
    if (data.session && data.user) set({ user: mapUser(data.user), profile: await loadProfile(data.user), isAuthenticated: true, isLoading: false });
    return { needsEmailConfirmation: !data.session };
  },
  updateProfile: async (profile) => {
    const userId = get().user?.id;
    if (!userId) throw new Error("Sign in to update your profile.");
    const { error } = await supabase.from("profiles").update({ full_name: profile.fullName, email: profile.email, phone: profile.phone, role: profile.role, workspace: profile.workspace, updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) throw error;
    set({ profile, user: { id: userId, name: profile.fullName, email: profile.email } });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
  },
}));
