import { create } from "zustand";
import { persist } from "zustand/middleware";
import { marketplaceModules, type MarketplaceModule } from "@/data/marketplace";
import { supabase } from "@/lib/supabase";

interface SubscriptionState {
  selectedIds: string[]; subscribedIds: string[]; trialEndsAt: Record<string, string>; drawerOpen: boolean;
  syncSubscriptions: () => Promise<void>; clearSubscriptions: () => void;
  addModule: (moduleId: string) => void; removeModule: (moduleId: string) => void; toggleModule: (moduleId: string) => void;
  clearCart: () => void; setDrawerOpen: (open: boolean) => void;
  subscribe: (moduleId: string) => Promise<void>; subscribeSelected: () => Promise<void>;
}

async function saveSubscriptions(moduleIds: string[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in before starting a trial.");
  const end = new Date(Date.now() + 30 * 86400000).toISOString();
  const rows = moduleIds.filter((id) => id === "object-detection" || id === "accident-detection").map((moduleId) => ({ user_id: user.id, module_id: moduleId, trial_ends_at: end }));
  if (rows.length) { const { error } = await supabase.from("subscriptions").upsert(rows, { onConflict: "user_id,module_id" }); if (error) throw error; }
  return end;
}

export const useSubscriptionStore = create<SubscriptionState>()(persist((set, get) => ({
  selectedIds: [], subscribedIds: [], trialEndsAt: {}, drawerOpen: true,
  syncSubscriptions: async () => {
    const { data, error } = await supabase.from("subscriptions").select("module_id,trial_ends_at").gt("trial_ends_at", new Date().toISOString());
    if (error) throw error;
    set({ subscribedIds: (data ?? []).map((row) => row.module_id), trialEndsAt: Object.fromEntries((data ?? []).map((row) => [row.module_id, row.trial_ends_at])) });
  },
  clearSubscriptions: () => set({ subscribedIds: [], trialEndsAt: {}, selectedIds: [] }),
  addModule: (moduleId) => set((state) => ({ selectedIds: state.selectedIds.includes(moduleId) ? state.selectedIds : [...state.selectedIds, moduleId] })),
  removeModule: (moduleId) => set((state) => ({ selectedIds: state.selectedIds.filter((id) => id !== moduleId) })),
  toggleModule: (moduleId) => set((state) => ({ selectedIds: state.selectedIds.includes(moduleId) ? state.selectedIds.filter((id) => id !== moduleId) : [...state.selectedIds, moduleId] })),
  clearCart: () => set({ selectedIds: [] }), setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  subscribe: async (moduleId) => {
    const end = await saveSubscriptions([moduleId]);
    set((state) => ({ subscribedIds: Array.from(new Set([...state.subscribedIds, moduleId])), trialEndsAt: { ...state.trialEndsAt, [moduleId]: end } }));
  },
  subscribeSelected: async () => {
    const ids = get().selectedIds; const end = await saveSubscriptions(ids);
    set((state) => ({ subscribedIds: Array.from(new Set([...state.subscribedIds, ...ids])), trialEndsAt: { ...state.trialEndsAt, ...Object.fromEntries(ids.map((id) => [id, end])) }, selectedIds: [] }));
  },
}), { name: "moroai-subscriptions", partialize: (state) => ({ selectedIds: state.selectedIds }) }));

export function getSelectedModules(selectedIds: string[]): MarketplaceModule[] { return marketplaceModules.filter((module) => selectedIds.includes(module.id)); }
export function getSubscriptionTotal(modules: MarketplaceModule[]): number { return modules.reduce((total, module) => total + module.price, 0); }
