import { Link } from "react-router-dom";
import { CheckCircle2, PackagePlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { purchasedModules } from "@/data/account";
import { routes } from "@/routes/paths";
import { cn } from "@/utils/cn";

const progressClassByModuleId: Record<string, string> = {
  human: "w-[86%]",
  object: "w-[74%]",
  threat: "w-[62%]",
  weapon: "w-[41%]",
  accident: "w-[57%]",
};

export function PurchasedModules() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Purchased Modules</h2>
          <p className="mt-1 text-sm text-slate-500">Active AI modules assigned to this workspace.</p>
        </div>
        <Link to={routes.marketplace}>
          <Button>
            <PackagePlus className="h-4 w-4" aria-hidden="true" />
            Buy More Modules
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {purchasedModules.map((module) => (
          <div key={module.id} className="rounded-xl border border-borderSubtle bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{module.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Usage health {module.usage}%</p>
                </div>
              </div>
              <Badge variant="success">{module.status}</Badge>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className={cn("h-full rounded-full bg-accent", progressClassByModuleId[module.id])} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
