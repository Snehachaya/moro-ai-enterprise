import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { MarketplaceModule } from "@/data/marketplace";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { cn } from "@/utils/cn";

interface ModulePlanCardProps {
  module: MarketplaceModule;
}

export function ModulePlanCard({ module }: ModulePlanCardProps) {
  const navigate = useNavigate();
  const selectedIds = useSubscriptionStore((state) => state.selectedIds);
  const addModule = useSubscriptionStore((state) => state.addModule);
  const toggleModule = useSubscriptionStore((state) => state.toggleModule);
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  const isSelected = selectedIds.includes(module.id);
  const isSubscribed = subscribedIds.includes(module.id);
  const isAvailable = module.id === "object-detection" || module.id === "accident-detection";
  const Icon = module.icon;

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Card
        className={cn(
          "h-full overflow-hidden transition",
          isSelected && "border-cyan-300/40 bg-cyan-400/[0.06]",
          module.highlighted && "border-cyan-300/30",
        )}
      >
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-accentSoft text-accent">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <Badge variant={module.highlighted ? "accent" : "neutral"}>{module.category}</Badge>
          </div>

          {module.route ? (
            <Link to={module.route} className="mt-5 block text-xl font-semibold text-white transition hover:text-cyan-100">
              {module.name}
            </Link>
          ) : (
            <h2 className="mt-5 text-xl font-semibold text-white">{module.name}</h2>
          )}
          <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">{module.description}</p>

          <ul className="mt-5 space-y-2">
            {module.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-borderSubtle pt-5">
            <div>
              <p className="text-2xl font-semibold text-white">₹{module.price.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-500">per {module.billingCycle}</p>
            </div>
            {!isAvailable ? <Badge variant="warning">Coming soon</Badge> : isSubscribed ? <Badge variant="success">Trial active</Badge> : isSelected ? <Badge variant="success">Selected</Badge> : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button type="button" disabled={!isAvailable || isSubscribed} onClick={() => { addModule(module.id); navigate("/subscription"); }}>
              {!isAvailable ? "Coming soon" : isSubscribed ? "Trial active" : "Subscribe"}
            </Button>
            <Button type="button" variant="secondary" disabled={!isAvailable || isSubscribed} onClick={() => toggleModule(module.id)}>
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {!isAvailable ? "Unavailable" : isSelected ? "Remove" : "Add Cart"}
            </Button>
          </div>
          {module.route ? (
            <Link to={module.route} className="mt-3">
              <Button type="button" variant="ghost" className="w-full">
                View full details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </motion.article>
  );
}
