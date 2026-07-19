import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn } from "lucide-react";
import { AppLogo } from "@/components/common/AppLogo";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

type PublicNavItem =
  | { kind: "anchor"; label: string; href: string }
  | { kind: "route"; label: string; to: string };

const navItems: PublicNavItem[] = [
  { kind: "anchor", label: "Features", href: "#features" },
  { kind: "route", label: "Marketplace", to: routes.marketplace },
  { kind: "route", label: "Pricing", to: routes.subscription },
  { kind: "anchor", label: "Contact", href: "#contact" },
];

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
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Landing navigation">
              {navItems.map((item) =>
                item.kind === "route" ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition",
                      "hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition",
                      "hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
            <div className="flex items-center gap-2">
              <Link to={routes.marketplace}>
                <Button variant="ghost" size="sm">Marketplace</Button>
              </Link>
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
