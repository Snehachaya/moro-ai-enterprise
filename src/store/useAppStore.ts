import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  activeOrganizationId: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveOrganizationId: (organizationId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  activeOrganizationId: "org-moro-global",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveOrganizationId: (activeOrganizationId) => set({ activeOrganizationId }),
}));
