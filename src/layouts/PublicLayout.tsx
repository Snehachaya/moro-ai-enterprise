import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn } from "lucide-react";
import { AppLogo } from "@/components/common/AppLogo";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

export function PublicLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated && location.pathname === routes.landing) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <AppLogo linked />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link to={routes.dashboard}>
                  <Button size="sm">
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to={routes.login}>
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
