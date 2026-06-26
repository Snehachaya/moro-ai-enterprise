import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return children;
}
