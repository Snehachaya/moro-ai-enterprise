import { AlertTriangle, Boxes, Cross, ShieldCheck, UserRoundSearch, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import type { KpiMetric } from "@/data/dashboard";
import { cn } from "@/utils/cn";

const iconById: Record<string, LucideIcon> = {
  human: UserRoundSearch,
  object: Boxes,
  threat: AlertTriangle,
  weapon: ShieldCheck,
  accident: Cross,
};

const severityClass: Record<KpiMetric["severity"], string> = {
  normal: "text-cyan-200 bg-cyan-400/10 border-cyan-300/20",
  tracking: "text-blue-200 bg-blue-400/10 border-blue-300/20",
  critical: "text-rose-200 bg-rose-400/10 border-rose-300/20",
  cleared: "text-emerald-200 bg-emerald-400/10 border-emerald-300/20",
  resolving: "text-amber-200 bg-amber-400/10 border-amber-300/20",
};

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const Icon = iconById[metric.id] ?? ShieldCheck;

  return (
    <Card className="h-full transition hover:border-cyan-300/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", severityClass[metric.severity])}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider", severityClass[metric.severity])}>
            {metric.status}
          </span>
        </div>
        <p className="mt-5 text-sm text-slate-400">{metric.label}</p>
        <p className="mt-1 text-3xl font-semibold text-white">{metric.value}</p>
      </CardContent>
    </Card>
  );
}
