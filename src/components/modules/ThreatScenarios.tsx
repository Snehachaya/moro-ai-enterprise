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
    <section className="border border-borderSubtle bg-[#0b0f16]/88 p-4 shadow-[0_0_36px_rgba(6,182,212,0.08)]">
      <h2 className="text-2xl font-semibold text-white">Identified Threats</h2>
      <p className="mt-2 text-sm text-slate-400">Critical situations requiring immediate intervention.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.95fr]">
        {module.scenarios.map((scenario, index) => {
          const Icon = scenarioIcons[scenario.title] ?? ShieldAlert;

          if (index === 0) {
            return (
              <Card key={scenario.title} className="overflow-hidden rounded-xl border-borderSubtle bg-[#0d1118] shadow-none">
                <div className="relative h-44 border-b border-borderSubtle bg-slate-950">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.72),rgba(127,29,29,0.32)),radial-gradient(circle_at_72%_45%,rgba(239,68,68,0.72),transparent_5rem)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(12deg,transparent_44%,rgba(248,113,113,0.22)_45%,transparent_47%),linear-gradient(168deg,transparent_44%,rgba(248,113,113,0.18)_45%,transparent_47%)]" />
                  <div className="absolute left-8 top-7 h-28 w-10 bg-slate-950/50" />
                  <div className="absolute left-24 top-5 h-32 w-14 bg-slate-950/45" />
                  <div className="absolute right-11 top-8 h-28 w-16 bg-slate-950/50" />
                  <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.85)]" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-rose-300" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-white">{scenario.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{scenario.description}</p>
                  {scenario.priority ? (
                    <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-300">{scenario.priority}</p>
                  ) : null}
                </div>
              </Card>
            );
          }

          return (
            <Card key={scenario.title} className="overflow-hidden rounded-xl border-borderSubtle bg-[#0d1118] shadow-none">
              <div className="grid h-full lg:grid-cols-[1fr_1.05fr]">
                <div className="p-8">
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
                <div className="relative min-h-72 border-t border-borderSubtle bg-black lg:border-l lg:border-t-0">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,8,23,0.96),rgba(15,23,42,0.8)),radial-gradient(circle_at_52%_48%,rgba(6,182,212,0.24),transparent_8rem)]" />
                  <div className="absolute inset-7 rotate-[-2deg] rounded-sm border border-cyan-300/35 bg-cyan-300/[0.03] shadow-[0_0_24px_rgba(6,182,212,0.15)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
                    <div className="absolute inset-x-0 bottom-0 h-12 border-t border-cyan-300/15 bg-cyan-300/[0.04]" />
                    <div className="absolute left-[41%] top-[28%] h-24 w-16 border-2 border-cyan-300 shadow-glow" />
                    <div className="absolute left-[45%] top-[35%] h-10 w-8 rounded-full border border-cyan-300/60" />
                    <div className="absolute left-[28%] top-[42%] h-20 w-28 border border-cyan-300/20" />
                    <div className="absolute right-[12%] top-[34%] h-24 w-24 border border-cyan-300/20" />
                  </div>
                  <div className="absolute bottom-5 left-8 right-8 h-8 rounded border border-cyan-300/15 bg-cyan-300/[0.04]" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 rounded-xl border border-borderSubtle bg-[radial-gradient(circle_at_82%_22%,rgba(244,63,94,0.12),transparent_18rem),#0d1118] p-8 lg:grid-cols-[minmax(0,0.8fr)_1px_minmax(0,1.6fr)] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <PawPrint className="h-5 w-5 text-blue-300" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-white">{module.animalIntrusion.title}</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{module.animalIntrusion.description}</p>
        </div>
        <div className="hidden h-28 bg-borderSubtle lg:block" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {module.animalIntrusion.categories.map((category, index) => {
            const Icon = animalIcons[index % animalIcons.length];
            return (
              <div key={category} className="flex min-h-24 flex-col items-center justify-center text-center">
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
