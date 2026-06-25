import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface PendingRegistration {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  pendingRegistration: PendingRegistration | null;
  login: (email: string) => void;
  prepareRegistration: (registration: PendingRegistration) => void;
  completeRegistration: () => void;
  logout: () => void;
}

function getNameFromEmail(email: string) {
  const [name] = email.split("@");
  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "MoroAI User";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingRegistration: null,
      login: (email) =>
        set({
          user: {
            id: crypto.randomUUID(),
            name: getNameFromEmail(email),
            email,
          },
          pendingRegistration: null,
        }),
      prepareRegistration: (registration) => set({ pendingRegistration: registration }),
      completeRegistration: () => {
        const pendingRegistration = get().pendingRegistration;

        if (!pendingRegistration) {
          return;
        }

        set({
          user: {
            id: crypto.randomUUID(),
            name: pendingRegistration.name,
            email: pendingRegistration.email,
          },
          pendingRegistration: null,
        });
      },
      logout: () => set({ user: null, pendingRegistration: null }),
    }),
    {
      name: "moroai-auth",
      partialize: (state) => ({
        user: state.user,
        pendingRegistration: state.pendingRegistration,
      }),
    },
  ),
);
