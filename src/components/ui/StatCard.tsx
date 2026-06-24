import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, trend, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        {Icon ? (
          <span className="rounded-lg border border-cyan-300/20 bg-accentSoft p-2 text-accent">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {trend ? <p className="mt-4 text-sm text-emerald-300">{trend}</p> : null}
    </Card>
  );
}
