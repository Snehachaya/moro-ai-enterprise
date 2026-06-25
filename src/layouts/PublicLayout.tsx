import { Link, Navigate, Outlet } from "react-router-dom";
import { AppLogo } from "@/components/common/AppLogo";
import { Button } from "@/components/ui/Button";
import { getLoggedInLandingRoute } from "@/routes/getLoggedInLandingRoute";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function PublicLayout() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to={getLoggedInLandingRoute()} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <AppLogo />
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Landing navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition",
                    "hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to={routes.login}>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to={routes.register}>
                <Button size="sm">Register</Button>
              </Link>
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
