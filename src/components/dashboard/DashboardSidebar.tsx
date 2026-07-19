import { Link } from "react-router-dom";
import { AlertTriangle, Boxes, Cross, Fingerprint, ShieldCheck, UserRoundSearch, type LucideIcon } from "lucide-react";
import { moduleNavItems } from "@/data/dashboard";
import { cn } from "@/utils/cn";

const iconById: Record<string, LucideIcon> = {
  human: UserRoundSearch,
  object: Boxes,
  owner: Fingerprint,
  threat: AlertTriangle,
  weapon: ShieldCheck,
  accident: Cross,
};

export function DashboardSidebar() {
  return (
    <aside className="rounded-xl border border-borderSubtle bg-surface/80 p-4 shadow-glass backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Detection Modules</p>
      </div>
      <nav className="space-y-2" aria-label="Dashboard module filters">
        {moduleNavItems.map((item) => {
          const Icon = iconById[item.id] ?? ShieldCheck;
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-left transition",
                item.id === "threat" ? "bg-rose-400/10 text-rose-100" : "text-slate-300 hover:border-borderSubtle hover:bg-white/[0.03]",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">{item.status}</span>
                </span>
              </span>
              <span className="text-sm font-semibold text-white">{item.count}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
