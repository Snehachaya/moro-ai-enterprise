import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  Download,
  LogOut,
  PackageCheck,
  Plus,
  Repeat2,
  UserCircle,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { accountProfile, purchasedModules } from "@/data/account";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const accountLinks = [
  { label: "My Profile", to: routes.account, icon: UserRound },
  { label: "Purchased Modules", to: `${routes.account}?section=modules`, icon: PackageCheck },
  { label: "Billing & Payments", to: `${routes.account}?section=billing`, icon: CreditCard },
  { label: "Notifications", to: routes.account, icon: Bell },
];

const quickActions = [
  { label: "Switch Account", to: `${routes.account}?section=switch`, icon: Repeat2 },
  { label: "Add New Account", to: `${routes.account}?section=switch`, icon: Plus },
  { label: "Download Invoices", to: `${routes.account}?section=billing`, icon: Download },
];

interface ProfileMenuProps {
  className?: string;
  variant?: "compact" | "avatar";
}

export function ProfileMenu({ className, variant = "compact" }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = user?.name ?? accountProfile.fullName;
  const displayEmail = user?.email ?? accountProfile.email;
  const activeModuleCount = purchasedModules.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant="secondary"
        size="sm"
        aria-label="Open profile details"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "relative overflow-hidden",
          variant === "avatar" && "h-10 w-10 rounded-full border-cyan-300/30 p-0",
        )}
      >
        {variant === "avatar" ? (
          <>
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(6,182,212,0.55),transparent_38%),linear-gradient(135deg,#0f172a,#020817)]" />
            <span className="relative text-xs font-bold text-white">MK</span>
            <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-400" />
          </>
        ) : (
          <UserCircle className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-borderSubtle bg-[#0b0f14]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <div className="border-b border-borderSubtle p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-cyan-300/30 bg-[radial-gradient(circle_at_35%_20%,rgba(6,182,212,0.55),transparent_38%),linear-gradient(135deg,#0f172a,#020817)]">
                  <span className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-cyan-400/20 to-transparent" />
                  <span className="absolute bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
                    MK
                  </span>
                  <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                  <p className="truncate text-xs text-slate-400">{displayEmail}</p>
                  <Badge variant="accent" className="mt-2 h-6 rounded-md px-2 text-[10px] uppercase tracking-wider">
                    Administrator
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Account</p>
              <nav className="space-y-1" aria-label="Profile account links">
                {accountLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-cyan-100" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mx-5 rounded-xl border border-borderSubtle bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Current Subscription</p>
                  <p className="mt-2 text-sm font-semibold text-cyan-100">Enterprise Plan</p>
                </div>
                <Badge variant="success" className="h-6 rounded-md px-2 text-[10px] uppercase">
                  Active
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                <span>Modules Active</span>
                <span>{activeModuleCount} / 5</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-full rounded-full bg-accent" />
              </div>
              <p className="mt-3 text-xs text-slate-500">Expires: 12 May 2027</p>
              <Link to={routes.subscription} onClick={() => setIsOpen(false)}>
                <Button className="mt-4 w-full">Manage Subscription</Button>
              </Link>
            </div>

            <div className="space-y-2 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Quick Actions</p>
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-borderSubtle p-5">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-md border border-borderSubtle text-rose-100 hover:bg-rose-500/10"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate(routes.home, { replace: true });
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">Sign Out</span>
                  <span className="block text-xs font-normal text-rose-100/60">Securely log out from MoroAI</span>
                </span>
              </Button>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <span>MoroAI</span>
                <span>-</span>
                <span>Modern Robotics</span>
                <span>-</span>
                <span>Version 1.8.0</span>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
