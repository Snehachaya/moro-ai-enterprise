import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function MarketplaceHeader() {
  const selectedCount = useSubscriptionStore((state) => state.selectedIds.length);

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <Badge variant="accent" className="gap-2">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          MoroAI Marketplace
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">Choose Your AI Modules</h1>
        <p className="mt-4 text-base leading-7 text-slate-400">
          Subscribe to the completed Object Detection and Accident Detection modules with a 30-day trial.
        </p>
      </div>
      <Link to={routes.subscription}>
        <Button variant="secondary" className="w-full lg:w-auto">
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Review Subscription ({selectedCount})
        </Button>
      </Link>
    </header>
  );
}
