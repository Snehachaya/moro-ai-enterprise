import { ArrowRight, BrainCircuit, Camera, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DetectionModule } from "@/types/module";
import { cn } from "@/utils/cn";

const accentClass: Record<DetectionModule["accent"], string> = {
  cyan: "from-cyan-400/24 to-cyan-300/5 border-cyan-300/25 text-cyan-100",
  blue: "from-blue-400/24 to-blue-300/5 border-blue-300/25 text-blue-100",
  red: "from-rose-500/24 to-rose-300/5 border-rose-300/25 text-rose-100",
  rose: "from-pink-500/24 to-pink-300/5 border-pink-300/25 text-pink-100",
  emerald: "from-emerald-400/24 to-emerald-300/5 border-emerald-300/25 text-emerald-100",
};

interface ModuleHeroProps {
  module: DetectionModule;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Badge variant="accent" className="gap-2">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          AI Active
        </Badge>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white lg:text-5xl">{module.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">{module.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {module.capabilities.map((capability) => (
            <span
              key={capability}
              className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
            >
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
              {capability}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg">
            Activate Module
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg">
            View Evidence Demo
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.32 }}
      >
        <Card className={cn("overflow-hidden bg-gradient-to-br p-5", accentClass[module.accent])}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/20">
                <Camera className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{module.name} Preview</p>
                <p className="text-xs text-slate-400">Live analysis channel</p>
              </div>
            </div>
            <Badge variant="success">AI Active</Badge>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_160px]">
            <div className="relative min-h-80 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.16),transparent_42%),radial-gradient(circle_at_62%_48%,rgba(248,113,113,0.16),transparent_9rem)]" />
              <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4">
                {[0, 1, 2, 3].map((cell) => (
                  <div key={cell} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
                    <span className="absolute left-3 top-3 text-[10px] uppercase tracking-widest text-slate-500">
                      Feed 0{cell + 1}
                    </span>
                    {cell === 1 ? <span className="absolute left-[42%] top-[26%] h-20 w-14 rounded border-2 border-cyan-300/80 shadow-glow" /> : null}
                    {cell === 2 ? <span className="absolute left-[30%] top-[48%] h-12 w-28 rounded border-2 border-rose-300/80" /> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <BrainCircuit className="h-5 w-5 text-accent" aria-hidden="true" />
                <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">{module.metric.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{module.metric.value}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Price</p>
                <p className="mt-2 text-xl font-semibold text-white">{module.price}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
