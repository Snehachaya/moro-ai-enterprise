import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DetectionModule } from "@/types/module";

interface ModulePageProps {
  module: DetectionModule;
}

export function ModulePage({ module }: ModulePageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mx-auto max-w-7xl space-y-6"
    >
      <SectionHeader eyebrow="Detection Module" title={module.name} description={module.summary} />
      <div className="grid gap-4 md:grid-cols-3">
        {module.capabilities.map((capability) => (
          <Card key={capability}>
            <CardContent>
              <p className="text-sm font-medium text-slate-200">{capability}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}
