import { BellRing, BrainCircuit, CheckCircle2, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DetectionModule } from "@/types/module";

const icons = [BrainCircuit, Cpu, CheckCircle2, BellRing];

interface ModuleWorkflowProps {
  module: DetectionModule;
}

export function ModuleWorkflow({ module }: ModuleWorkflowProps) {
  if (module.id === "threat") {
    return (
      <section className="border border-dashed border-cyan-300/40 bg-[#0b0f16]/70 p-5 shadow-[0_0_36px_rgba(6,182,212,0.08)]">
        <h2 className="text-center text-2xl font-semibold text-white">System Workflow</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {module.workflow.map((step, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04, duration: 0.22 }}
                className="border border-borderSubtle bg-surface/70 p-5 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-300/20 bg-white/[0.06] text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Step 0{index + 1}</p>
                <h3 className="mt-2 text-sm font-semibold text-white">{step}</h3>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <SectionHeader title="Module Workflow" description="A clear operational path from live signal to reviewed action." />
      <div className="grid gap-4 md:grid-cols-4">
        {module.workflow.map((step, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
              className="rounded-xl border border-borderSubtle bg-surface/80 p-5 text-center shadow-glass backdrop-blur-xl"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accentSoft text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Step {index + 1}</p>
              <h3 className="mt-2 font-semibold text-white">{step}</h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
