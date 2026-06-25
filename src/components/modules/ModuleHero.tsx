import { ArrowLeft, ArrowRight, BrainCircuit, Camera, CheckCircle2, ShieldCheck } from "lucide-react";
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
  if (module.id === "human") {
    return (
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center">
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
          <Card className="overflow-hidden border-cyan-300/25 bg-[#050808] p-7 shadow-[0_0_70px_rgba(6,182,212,0.13)]">
            <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-cyan-300/15 bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(6,182,212,0.19),transparent_15rem),radial-gradient(circle_at_50%_70%,rgba(6,182,212,0.09),transparent_16rem)]" />
              <div className="absolute left-1/2 top-10 h-[345px] w-[360px] -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-[#021014]/75 shadow-[inset_0_0_40px_rgba(6,182,212,0.1)]" />

              <div className="absolute left-1/2 top-14 h-[380px] w-[360px] -translate-x-1/2">
                <div className="absolute left-[17%] top-[8%] h-[300px] w-[260px] rounded-[48%] border border-cyan-300/60 bg-[radial-gradient(circle_at_56%_45%,rgba(6,182,212,0.14),transparent_10rem)] shadow-[0_0_34px_rgba(6,182,212,0.35)]" />
                <div className="absolute left-[20%] top-[10%] h-[294px] w-[252px] rounded-[48%] bg-[linear-gradient(90deg,transparent_49%,rgba(34,211,238,0.27)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(34,211,238,0.18)_50%,transparent_51%)] bg-[size:18px_18px] opacity-80" />
                <div className="absolute left-[18%] top-[8%] h-[300px] w-[260px] rounded-[48%] bg-[repeating-radial-gradient(ellipse_at_center,transparent_0,transparent_15px,rgba(34,211,238,0.28)_16px,transparent_17px)] opacity-70" />
                <div className="absolute left-[39%] top-[37%] h-4 w-20 rounded-full border border-cyan-200/70 bg-cyan-200/20 shadow-[0_0_20px_rgba(34,211,238,0.75)]" />
                <div className="absolute right-[18%] top-[38%] h-4 w-16 rounded-full border border-cyan-200/70 bg-cyan-200/20 shadow-[0_0_20px_rgba(34,211,238,0.75)]" />
                <div className="absolute right-[17%] top-[45%] h-16 w-20 rounded-r-full border-r-2 border-t border-cyan-300/45" />
                <div className="absolute left-[6%] top-[38%] h-28 w-20 rounded-l-full border-l-2 border-cyan-300/45" />
                <div className="absolute bottom-[20%] left-[30%] h-2 w-28 rounded-full bg-cyan-200/55 shadow-[0_0_14px_rgba(34,211,238,0.65)]" />
              </div>

              <div className="absolute left-14 top-20 w-28 space-y-3 text-cyan-100/55">
                <div className="h-12 rounded-full border border-cyan-300/35" />
                {["bio_vector", "iris_lock", "match_curve"].map((label) => (
                  <div key={label} className="rounded border border-cyan-300/15 bg-cyan-300/[0.04] p-2">
                    <p className="text-[9px] uppercase tracking-[0.18em]">{label}</p>
                    <div className="mt-2 h-1 rounded-full bg-cyan-300/50" />
                  </div>
                ))}
              </div>

              <div className="absolute right-14 top-20 h-72 w-24 border-r border-cyan-300/35">
                <div className="absolute right-3 top-0 h-16 w-px bg-cyan-300/55" />
                <div className="absolute right-3 top-24 h-28 w-px bg-cyan-300/55" />
                <div className="absolute right-3 bottom-0 h-10 w-px bg-cyan-300/55" />
                {[
                  "top-5 w-10",
                  "top-20 w-6",
                  "top-36 w-10",
                  "top-52 w-6",
                ].map((position) => (
                  <span key={position} className={`absolute right-0 h-1 bg-cyan-300/50 ${position}`} />
                ))}
              </div>

              <div className="absolute bottom-14 left-1/2 w-[60%] -translate-x-1/2 text-center">
                <p className="font-mono text-lg font-semibold uppercase tracking-[0.32em] text-cyan-100">Scanning...</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-950">
                  <div className="h-full w-[74%] rounded-full bg-cyan-300 shadow-glow" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    );
  }

  if (module.id === "threat") {
    return (
      <section className="rounded-none border border-dashed border-cyan-300/40 bg-[#0b0f16]/80 px-6 py-14 text-center shadow-[0_0_36px_rgba(6,182,212,0.08)]">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Threat Detection
            </span>
            <span className="hidden gap-6 md:flex">
              <span>Modules</span>
              <span>Intelligence</span>
              <span>Reports</span>
              <span className="text-cyan-200">Security</span>
            </span>
          </div>
          <Badge variant="success" className="gap-2">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            AI Active
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            {module.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">{module.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">
              Try Demo
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
