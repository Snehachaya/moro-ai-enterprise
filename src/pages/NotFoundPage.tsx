import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="max-w-lg">
        <CardContent className="p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">404</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Page not found</h1>
          <p className="mt-3 text-slate-400">The route you requested is not available in MoroAI.</p>
          <Link
            className={cn(
              "mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-300",
            )}
            to="/"
          >
            Return home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
