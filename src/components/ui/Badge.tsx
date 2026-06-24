import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: "border-slate-500/20 bg-slate-400/10 text-slate-300",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  accent: "border-cyan-300/20 bg-accentSoft text-cyan-100",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
