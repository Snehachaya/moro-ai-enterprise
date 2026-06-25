import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { detectionModules } from "@/data/modules";
import type { DetectionModule } from "@/types/module";

interface ModuleRelatedProps {
  module: DetectionModule;
}

export function ModuleRelated({ module }: ModuleRelatedProps) {
  const relatedModules = detectionModules.filter((item) => item.id !== module.id).slice(0, 3);

  return (
    <section className="space-y-8">
      <SectionHeader title="Related Modules" description="Expand coverage with complementary MoroAI detection models." />
      <div className="grid gap-4 md:grid-cols-3">
        {relatedModules.map((relatedModule) => (
          <Link key={relatedModule.id} to={relatedModule.route}>
            <Card className="h-full transition hover:-translate-y-1 hover:border-cyan-300/30">
              <CardContent>
                <h3 className="text-lg font-semibold text-white">{relatedModule.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{relatedModule.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  View module
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
