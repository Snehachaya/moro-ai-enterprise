import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModuleCapabilities } from "@/components/modules/ModuleCapabilities";
import { ModuleHero } from "@/components/modules/ModuleHero";
import { ModulePricing } from "@/components/modules/ModulePricing";
import { ModuleRelated } from "@/components/modules/ModuleRelated";
import { ModuleWorkflow } from "@/components/modules/ModuleWorkflow";
import { ThreatScenarios } from "@/components/modules/ThreatScenarios";
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
      <div>
        <Link to={routes.dashboard}>
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <ModuleHero module={module} />
      <ModuleWorkflow module={module} />
      {module.id === "threat" ? <ThreatScenarios module={module} /> : null}
      <ModuleCapabilities module={module} />
      <ModulePricing module={module} />
      <ModuleRelated module={module} />
    </div>
  );
}
