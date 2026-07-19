import { Link } from "react-router-dom";
import { AlertTriangle, Boxes, Cross, ShieldCheck, UserRoundSearch, type LucideIcon } from "lucide-react";
import { moduleNavItems } from "@/data/dashboard";
import { cn } from "@/utils/cn";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const iconById: Record<string, LucideIcon> = {
  human: UserRoundSearch,
  object: Boxes,
  threat: AlertTriangle,
  weapon: ShieldCheck,
  accident: Cross,
};

export function DashboardSidebar() {
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  return (
    <aside className="rounded-xl border border-borderSubtle bg-surface/80 p-4 shadow-glass backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Detection Modules</p>
      </div>
      <nav className="space-y-2" aria-label="Dashboard module filters">
        {moduleNavItems.map((item) => {
          const Icon = iconById[item.id] ?? ShieldCheck;
          const moduleId = `${item.id}-detection`;
          const available = item.id === "object" || item.id === "accident";
          const active = available && subscribedIds.includes(moduleId);
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-left transition",
                active ? "bg-cyan-400/10 text-cyan-100" : "text-slate-400 hover:border-borderSubtle hover:bg-white/[0.03]",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">{active ? "ACTIVE" : available ? "INACTIVE" : "COMING SOON"}</span>
                </span>
              </span>
              <span className="text-sm font-semibold text-white">{active ? item.count : 0}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
