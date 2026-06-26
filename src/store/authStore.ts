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
  token: string | null;
  isAuthenticated: boolean;
  pendingRegistration: PendingRegistration | null;
  login: (email?: string) => void;
  prepareRegistration: (registration: PendingRegistration) => void;
  completeRegistration: () => void;
  logout: () => void;
}

const authTokenKey = "moroai-auth-token";

function createAuthToken() {
  return `moroai_${crypto.randomUUID()}`;
}

function storeAuthToken(token: string) {
  localStorage.setItem(authTokenKey, token);
}

function clearAuthToken() {
  localStorage.removeItem(authTokenKey);
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
      token: null,
      isAuthenticated: false,
      pendingRegistration: null,
      login: (email = "security.admin@moroai.com") => {
        const token = createAuthToken();
        storeAuthToken(token);

        return set({
          token,
          isAuthenticated: true,
          user: {
            id: crypto.randomUUID(),
            name: getNameFromEmail(email),
            email,
          },
          pendingRegistration: null,
        });
      },
      prepareRegistration: (registration) => set({ pendingRegistration: registration }),
      completeRegistration: () => {
        const pendingRegistration = get().pendingRegistration;

        if (!pendingRegistration) {
          return;
        }

        const token = createAuthToken();
        storeAuthToken(token);

        set({
          token,
          isAuthenticated: true,
          user: {
            id: crypto.randomUUID(),
            name: pendingRegistration.name,
            email: pendingRegistration.email,
          },
          pendingRegistration: null,
        });
      },
      logout: () => {
        clearAuthToken();
        set({ user: null, token: null, isAuthenticated: false, pendingRegistration: null });
      },
    }),
    {
      name: "moroai-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        pendingRegistration: state.pendingRegistration,
      }),
    },
  ),
);
