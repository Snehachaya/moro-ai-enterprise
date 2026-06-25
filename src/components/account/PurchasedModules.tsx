import { Link } from "react-router-dom";
import { Boxes, PackagePlus, ScanFace, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { purchasedModules } from "@/data/account";
import { routes } from "@/routes/paths";
import { cn } from "@/utils/cn";

const progressClassByModuleId: Record<string, string> = {
  human: "w-[86%]",
  object: "w-[92%]",
  threat: "w-[70%]",
  weapon: "w-[61%]",
  accident: "w-[82%]",
};

const moduleIcons: Record<string, typeof ScanFace> = {
  human: ScanFace,
  object: Boxes,
  threat: ShieldCheck,
  weapon: Wrench,
  accident: TriangleAlert,
};

export function PurchasedModules() {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="sr-only">
          <h2>Purchased Modules</h2>
        </div>
        <Link to={routes.marketplace}>
          <Button>
            <PackagePlus className="h-4 w-4" aria-hidden="true" />
            Buy More Modules
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
        {purchasedModules.map((module) => {
          const Icon = moduleIcons[module.id] ?? ShieldCheck;

          return (
          <div key={module.id} className="rounded-lg border border-borderSubtle bg-[#0b0f14]/95 p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#161b2a] text-cyan-100">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <Badge variant="success" className="uppercase tracking-wider">{module.status}</Badge>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">{module.name}</h3>
            <p className="mt-2 text-sm text-slate-400">Pro Plan • Expires {module.expires}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className={cn("h-full rounded-full bg-cyan-200", progressClassByModuleId[module.id])} />
            </div>
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
