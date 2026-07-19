import { AlertTriangle, Boxes, Cross, ShieldAlert, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { detectionModules } from "@/data/modules";
import { cn } from "@/utils/cn";
import type { DetectionModuleId } from "@/types/module";

const iconByModule: Record<DetectionModuleId, typeof UserRoundSearch> = {
  human: UserRoundSearch,
  object: Boxes,
  threat: AlertTriangle,
  weapon: ShieldAlert,
  accident: Cross,
};

const accentByModule: Record<DetectionModuleId, string> = {
  human: "text-cyan-200 bg-cyan-400/10 border-cyan-300/20",
  object: "text-indigo-200 bg-indigo-400/10 border-indigo-300/20",
  threat: "text-rose-200 bg-rose-400/10 border-rose-300/20",
  weapon: "text-pink-200 bg-pink-400/10 border-pink-300/20",
  accident: "text-emerald-200 bg-emerald-400/10 border-emerald-300/20",
};

export function DetectionModules() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          align="center"
          eyebrow="What is MoroAI?"
          title="Five detection modules working as one security fabric"
          description="MoroAI combines specialized computer-vision models into a unified command experience for enterprise surveillance teams."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {detectionModules.map((module, index) => {
            const Icon = iconByModule[module.id];
            return (
              <motion.article
                key={module.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04, duration: 0.28 }}
              >
                <Link to={module.route}>
                  <Card className="h-full transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30">
                    <CardContent>
                      <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl border", accentByModule[module.id])}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-lg font-semibold text-white">{module.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{module.summary}</p>
                      <ul className="mt-5 space-y-2">
                        {module.capabilities.map((capability) => (
                          <li key={capability} className="flex gap-2 text-xs text-slate-400">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                            {capability}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
