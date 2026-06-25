import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { routes } from "@/routes/paths";
import { cn } from "@/utils/cn";

interface AppLogoProps {
  className?: string;
  linked?: boolean;
}

export function AppLogo({ className, linked = false }: AppLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3 text-white", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 shadow-glow">
        <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-[0.02em]">MoroAI</span>
    </div>
  );

  if (!linked) {
    return content;
  }

  return (
    <Link to={routes.home} className="inline-flex rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300/40">
      {content}
    </Link>
  );
}
