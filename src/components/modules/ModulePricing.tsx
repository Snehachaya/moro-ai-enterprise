import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import type { DetectionModule } from "@/types/module";

interface ModulePricingProps {
  module: DetectionModule;
}

export function ModulePricing({ module }: ModulePricingProps) {
  if (module.id === "threat") {
    return (
      <section className="mx-auto max-w-5xl border border-dashed border-cyan-300/40 bg-[#0b0f16]/80 p-8 shadow-[0_0_36px_rgba(6,182,212,0.08)]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className="inline-flex rounded bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Enterprise Tier
            </p>
            <h2 className="mt-5 text-3xl font-semibold text-white">Unlock Threat Detection Pro</h2>
            <p className="mt-3 text-4xl font-semibold text-white">
              ₹1,499 <span className="text-sm font-normal text-slate-400">/month</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Comprehensive perimeter and interior security powered by advanced neural networks.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button>Start Free Trial</Button>
              <Link to={routes.subscription}>
                <Button variant="secondary" className="w-full">
                  Buy Subscription
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-borderSubtle pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <ul className="space-y-4">
              {[
                "Fire Detection",
                "Animal Intrusion",
                "Robbery Detection",
                "Instant Alerts",
                "Multi-Camera Support",
                "Screenshot Evidence",
                "Priority Support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
      <Card className="overflow-hidden border-cyan-300/20 bg-[#06101f]/90">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-white">Deploy {module.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Add this module to your MoroAI workspace and connect it to sites, cameras, alert policies, and evidence
            retention workflows.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Encrypted evidence", "Live alerts", "Operator review"].map((item) => (
              <div key={item} className="rounded-xl border border-borderSubtle bg-white/[0.03] p-4">
                <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                <p className="mt-4 text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-cyan-300/25">
        <CardContent className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Module Pricing</p>
          <p className="mt-4 text-3xl font-semibold text-white">{module.price}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{module.pricingNote}</p>
          <Link to={routes.subscription} className="mt-6 block">
            <Button className="w-full" size="lg">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Subscribe
            </Button>
          </Link>
          <Link to={routes.marketplace} className="mt-3 block">
            <Button variant="secondary" className="w-full">
              Compare modules
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
