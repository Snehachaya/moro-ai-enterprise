import { BellRing, BrainCircuit, Camera, Cpu, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  { label: "Monitoring", detail: "Camera streams enter the secure AI pipeline.", icon: Camera },
  { label: "AI Analysis", detail: "Models classify people, objects, risks, and motion.", icon: BrainCircuit },
  { label: "Recognition Engine", detail: "Events are correlated with context and confidence.", icon: Cpu },
  { label: "Instant Alerts", detail: "Teams receive prioritized notifications in real time.", icon: BellRing },
  { label: "Live Dashboard", detail: "Operators review evidence, trends, and response state.", icon: LayoutDashboard },
];

export function Timeline() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader align="center" title="How MoroAI Works" description="From live camera input to auditable action in five focused steps." />
        <div className="relative mt-14 grid gap-5 md:grid-cols-5">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="relative rounded-xl border border-borderSubtle bg-surface/70 p-5 text-center shadow-glass backdrop-blur-xl"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-accentSoft text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Step #{index + 1}</p>
                <h3 className="mt-2 font-semibold text-white">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
