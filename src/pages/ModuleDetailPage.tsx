import { Navigate } from "react-router-dom";
import { ModuleCapabilities } from "@/components/modules/ModuleCapabilities";
import { ModuleHero } from "@/components/modules/ModuleHero";
import { ModulePricing } from "@/components/modules/ModulePricing";
import { ModuleRelated } from "@/components/modules/ModuleRelated";
import { ModuleWorkflow } from "@/components/modules/ModuleWorkflow";
import { routes } from "@/routes/paths";
import type { DetectionModule } from "@/types/module";

interface ModuleDetailPageProps {
  module?: DetectionModule;
}

export function ModuleDetailPage({ module }: ModuleDetailPageProps) {
  if (!module) {
    return <Navigate to={routes.marketplace} replace />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-12">
      <ModuleHero module={module} />
      <ModuleWorkflow module={module} />
      <ModuleCapabilities module={module} />
      <ModulePricing module={module} />
      <ModuleRelated module={module} />
    </div>
  );
}
