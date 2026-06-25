import { create } from "zustand";
import { marketplaceModules, type MarketplaceModule } from "@/data/marketplace";

interface SubscriptionState {
  selectedIds: string[];
  drawerOpen: boolean;
  addModule: (moduleId: string) => void;
  removeModule: (moduleId: string) => void;
  toggleModule: (moduleId: string) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  selectedIds: [],
  drawerOpen: true,
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
}));

export function getSelectedModules(selectedIds: string[]): MarketplaceModule[] {
  return marketplaceModules.filter((module) => selectedIds.includes(module.id));
}

export function getSubscriptionTotal(modules: MarketplaceModule[]): number {
  return modules.reduce((total, module) => total + module.price, 0);
}
