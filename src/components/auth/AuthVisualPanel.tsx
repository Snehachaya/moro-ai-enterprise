import { Activity, BrainCircuit, Camera, LockKeyhole, Radar, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";
import { Badge } from "@/components/ui/Badge";

const featurePills = ["Human detection", "Threat recognition", "Edge privacy", "Live alerts"];

export function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden border-r border-borderSubtle bg-surface/40 p-8 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(6,182,212,0.16),transparent_24rem),radial-gradient(circle_at_88%_74%,rgba(99,102,241,0.12),transparent_28rem)]" />
      <div className="relative z-10">
        <AppLogo />
        <Badge variant="accent" className="mt-10 gap-2">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Secure access portal
        </Badge>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-white">
          Enterprise AI surveillance starts with trusted identity.
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-slate-400">
          Manage detection modules, sites, users, evidence, and billing from a protected command experience.
        </p>
        <div className="mt-7 flex max-w-lg flex-wrap gap-3">
          {featurePills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-borderSubtle bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 rounded-2xl border border-cyan-300/20 bg-[#06101f]/88 p-5 shadow-glass backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">MoroAI Control Preview</p>
              <p className="text-xs text-slate-500">Encrypted site intelligence</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Live
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Feeds", value: "128", icon: Activity },
            { label: "Models", value: "5", icon: BrainCircuit },
            { label: "Policy", value: "SAML", icon: LockKeyhole },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-borderSubtle bg-white/[0.04] p-3">
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                <p className="mt-4 text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="text-lg font-semibold text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
        <div className="relative mt-4 min-h-44 overflow-hidden rounded-xl border border-borderSubtle bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),transparent_42%),radial-gradient(circle_at_60%_55%,rgba(248,113,113,0.16),transparent_8rem)]" />
          <div className="absolute left-[42%] top-[24%] h-20 w-14 rounded border-2 border-cyan-300/80 shadow-glow" />
          <div className="absolute bottom-4 left-4 rounded-lg border border-cyan-300/20 bg-slate-950/80 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <Radar className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-widest text-cyan-100">Identity verified</span>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
