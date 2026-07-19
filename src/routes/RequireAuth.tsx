import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) return <div className="grid min-h-[50vh] place-items-center text-sm text-slate-400">Connecting to your secure workspace...</div>;

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return children;
}
