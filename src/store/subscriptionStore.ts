import { create } from "zustand";
import { persist } from "zustand/middleware";
import { marketplaceModules, type MarketplaceModule } from "@/data/marketplace";

interface SubscriptionState {
  selectedIds: string[];
  subscribedIds: string[];
  drawerOpen: boolean;
  addModule: (moduleId: string) => void;
  removeModule: (moduleId: string) => void;
  toggleModule: (moduleId: string) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  subscribe: (moduleId: string) => void;
  subscribeSelected: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(persist((set) => ({
  selectedIds: [], subscribedIds: [], drawerOpen: true,
  addModule: (moduleId) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(moduleId) ? state.selectedIds : [...state.selectedIds, moduleId],
    })),
  removeModule: (moduleId) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== moduleId),
    })),
  toggleModule: (moduleId) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(moduleId)
        ? state.selectedIds.filter((selectedId) => selectedId !== moduleId)
        : [...state.selectedIds, moduleId],
    })),
  clearCart: () => set({ selectedIds: [] }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  subscribe: (moduleId) => set((state) => ({ subscribedIds: state.subscribedIds.includes(moduleId) ? state.subscribedIds : [...state.subscribedIds, moduleId] })),
  subscribeSelected: () => set((state) => ({ subscribedIds: Array.from(new Set([...state.subscribedIds, ...state.selectedIds])), selectedIds: [] })),
}), { name: "moroai-subscriptions", partialize: (state) => ({ selectedIds: state.selectedIds, subscribedIds: state.subscribedIds }) }));

export function getSelectedModules(selectedIds: string[]): MarketplaceModule[] {
  return marketplaceModules.filter((module) => selectedIds.includes(module.id));
}

export function getSubscriptionTotal(modules: MarketplaceModule[]): number {
  return modules.reduce((total, module) => total + module.price, 0);
}
