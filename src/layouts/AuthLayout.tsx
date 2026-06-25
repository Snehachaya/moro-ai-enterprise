import { Outlet } from "react-router-dom";
import { AuthLayout as AuthShell } from "@/components/auth/AuthLayout";

export function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
