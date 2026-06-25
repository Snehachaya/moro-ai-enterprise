import { Activity, ArrowRight, BrainCircuit, Camera, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/routes/paths";

const featurePills = ["24/7 AI vigilance", "Threat recognition", "Instant alerts"];
const feedCells = ["Gate A", "Lobby", "Parking", "Warehouse", "Office", "Perimeter"];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(6,182,212,0.18),transparent_30rem),radial-gradient(circle_at_86%_16%,rgba(99,102,241,0.16),transparent_28rem)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <Badge variant="accent" className="gap-2">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Advanced Security Ecosystem
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Future of Intelligent Surveillance and Safety
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Empowering enterprise-grade security with five core detection modules. Real-time vision intelligence for
            safer sites, faster response, and stronger operational control.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                {pill}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={routes.register}>
              <Button size="lg" className="w-full sm:w-auto">
                Request System Demo
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to={routes.login}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="relative"
        >
          <div className="absolute -left-8 top-12 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <Card className="relative overflow-hidden border-cyan-300/20 bg-[#06101f]/88 p-4">
            <div className="mb-4 flex items-center justify-between border-b border-borderSubtle pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">AI Camera Preview</p>
                  <p className="text-xs text-slate-500">Scanning_Module_01</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Live
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-borderSubtle bg-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.9),rgba(8,18,33,0.7)),radial-gradient(circle_at_50%_42%,rgba(6,182,212,0.2),transparent_18rem)]" />
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-3">
                  {feedCells.map((cell, index) => (
                    <div key={cell} className="relative overflow-hidden rounded-lg border border-white/8 bg-white/[0.04]">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(248,113,113,0.16),transparent_7rem)]" />
                      <span className="absolute left-2 top-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {cell}
                      </span>
                      {index === 1 ? (
                        <span className="absolute left-[38%] top-[28%] h-20 w-12 rounded border-2 border-cyan-300/80 shadow-glow" />
                      ) : null}
                      {index === 4 ? (
                        <span className="absolute left-[48%] top-[36%] h-14 w-20 rounded border-2 border-rose-400/80 shadow-[0_0_24px_rgba(251,113,133,0.22)]" />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 rounded-lg border border-cyan-300/20 bg-slate-950/80 px-3 py-2 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-widest text-cyan-200">Person: Known_ID_402</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Confidence", value: "98.4%", icon: BrainCircuit },
                  { label: "Active Feeds", value: "128", icon: Activity },
                  { label: "Encrypted", value: "Edge AI", icon: LockKeyhole },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-xl border border-borderSubtle bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                      <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
                    </div>
                  );
                })}
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-200">Threat Detected</p>
                  <p className="mt-2 text-sm text-slate-300">Knife-like object detected near restricted zone.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
