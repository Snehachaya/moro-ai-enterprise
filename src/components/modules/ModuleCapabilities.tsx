import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DetectionModule } from "@/types/module";

interface ModuleCapabilitiesProps {
  module: DetectionModule;
}

export function ModuleCapabilities({ module }: ModuleCapabilitiesProps) {
  return (
    <section className="space-y-8">
      <SectionHeader title="Capabilities" description="Production-ready controls for day-to-day security operations." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {module.features.map((feature) => (
          <Card key={feature} className="transition hover:border-cyan-300/30">
            <CardContent className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-white">{feature}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Configurable AI controls, confidence thresholds, evidence history, and operator review support.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
