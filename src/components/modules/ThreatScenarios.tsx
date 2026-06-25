import { BadgeCheck, Bike, Bug, Dog, Flame, PawPrint, Rabbit, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { DetectionModule } from "@/types/module";

const scenarioIcons: Record<string, LucideIcon> = {
  "Fire Detection": Flame,
  "Robbery Detection": ShieldAlert,
};

const animalIcons: LucideIcon[] = [Dog, Bike, Rabbit, Bug];

interface ThreatScenariosProps {
  module: DetectionModule;
}

export function ThreatScenarios({ module }: ThreatScenariosProps) {
  if (!module.scenarios || !module.animalIntrusion) {
    return null;
  }

  return (
    <section className="border border-dashed border-cyan-300/40 bg-[#0b0f16]/70 p-5 shadow-[0_0_36px_rgba(6,182,212,0.08)]">
      <h2 className="text-2xl font-semibold text-white">Identified Threats</h2>
      <p className="mt-2 text-sm text-slate-400">Critical situations requiring immediate intervention.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {module.scenarios.map((scenario, index) => {
          const Icon = scenarioIcons[scenario.title] ?? ShieldAlert;
          return (
            <Card key={scenario.title} className={index === 1 ? "lg:col-span-2 overflow-hidden" : "overflow-hidden"}>
              <div className={index === 1 ? "grid h-full lg:grid-cols-[1fr_1.15fr]" : ""}>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-rose-300" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-white">{scenario.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{scenario.description}</p>
                  <div className="mt-5 space-y-2">
                    {scenario.highlights.map((highlight) => (
                      <p key={highlight} className="flex items-center gap-2 text-xs text-cyan-200">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        {highlight}
                      </p>
                    ))}
                  </div>
                  {scenario.priority ? (
                    <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-300">{scenario.priority}</p>
                  ) : null}
                </div>
                {index === 1 ? (
                  <div className="relative min-h-64 border-t border-borderSubtle bg-slate-950 lg:border-l lg:border-t-0">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,8,23,0.72)),radial-gradient(circle_at_45%_48%,rgba(6,182,212,0.24),transparent_9rem)]" />
                    <div className="absolute left-[42%] top-[26%] h-28 w-20 rounded border-2 border-cyan-300/80 shadow-glow" />
                    <div className="absolute bottom-4 left-4 right-4 h-10 rounded border border-cyan-300/20 bg-cyan-400/5" />
                  </div>
                ) : (
                  <div className="relative h-40 border-t border-borderSubtle bg-slate-950">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(39,39,42,0.8),rgba(2,8,23,0.7)),radial-gradient(circle_at_70%_45%,rgba(239,68,68,0.4),transparent_7rem)]" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 border-t border-borderSubtle pt-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <div>
          <div className="flex items-center gap-3">
            <PawPrint className="h-5 w-5 text-blue-300" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-white">{module.animalIntrusion.title}</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{module.animalIntrusion.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {module.animalIntrusion.categories.map((category, index) => {
            const Icon = animalIcons[index % animalIcons.length];
            return (
              <div key={category} className="flex min-h-28 flex-col items-center justify-center border border-borderSubtle bg-white/[0.02] text-center">
                <Icon className="h-7 w-7 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-xs font-medium text-slate-300">{category}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
