import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return children;
}
