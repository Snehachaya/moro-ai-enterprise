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
