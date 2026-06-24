import { ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 text-white", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 shadow-glow">
        <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-[0.02em]">MoroAI</span>
    </div>
  );
}
