import { Crown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MarketplaceModule } from "@/data/marketplace";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface BundleCardProps {
  bundle: MarketplaceModule;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const addModule = useSubscriptionStore((state) => state.addModule);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <Card className="overflow-hidden border-cyan-300/25 bg-[#06101f]/92">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-accentSoft text-accent">
              <Crown className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">{bundle.name}</h2>
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  Best Value
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{bundle.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {bundle.features.map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-3xl font-semibold text-white">₹{bundle.price.toLocaleString("en-IN")}</p>
            <p className="text-sm text-slate-500">per month</p>
            <Button className="w-full lg:w-auto" onClick={() => addModule(bundle.id)}>
              Subscribe to Suite
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
