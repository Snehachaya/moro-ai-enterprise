import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import { AppLogo } from "@/components/common/AppLogo";
import { ProfileMenu } from "@/components/account/ProfileMenu";
import { Button } from "@/components/ui/Button";
import { primaryNavigation, accountNavigation } from "@/data/navigation";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = [...primaryNavigation, ...accountNavigation];
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-background text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-borderSubtle bg-surface/90 px-4 py-5 backdrop-blur-xl lg:block">
        <AppLogo className="px-2" linked />
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition",
                    "hover:bg-white/5 hover:text-white",
                    isActive && "bg-accentSoft text-cyan-100",
                  )
                }
              >
                {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {mobileNavOpen ? <div className="fixed inset-0 z-50 lg:hidden">
        <button type="button" className="absolute inset-0 bg-slate-950/80" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />
        <aside className="absolute inset-y-0 left-0 w-[86vw] max-w-80 overflow-y-auto border-r border-borderSubtle bg-surface p-4 shadow-2xl">
          <div className="flex items-center justify-between"><AppLogo linked /><Button variant="ghost" size="sm" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X className="h-5 w-5" /></Button></div>
          <p className="mt-8 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace navigation</p>
          <nav className="mt-3 space-y-1" aria-label="Mobile workspace navigation">{navigation.map((item) => { const Icon = item.icon; return <NavLink key={item.path} to={item.path} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white", isActive && "bg-accentSoft text-cyan-100")}>{Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}{item.label}</NavLink>; })}</nav>
        </aside>
      </div> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-borderSubtle bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)}>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
            <div className="hidden items-center gap-2 rounded-lg border border-borderSubtle bg-white/[0.03] px-3 py-2 text-sm text-slate-500 md:flex">
              <Search className="h-4 w-4" aria-hidden="true" />
              Search incidents, devices, or users
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">{profile?.fullName || user?.name || "MoroAI User"}</p>
              <p className="text-xs text-slate-500">{profile?.email || user?.email || "Authenticated"}</p>
            </div>
            <Button variant="secondary" size="sm" aria-label="Notifications">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </Button>
            <ProfileMenu variant="avatar" />
            <Button
              variant="secondary"
              size="sm"
              aria-label="Logout"
              onClick={() => {
                void logout().then(() => navigate(routes.home, { replace: true }));
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
