import { Link } from "react-router-dom";
import { Boxes, PackagePlus, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { marketplaceModules } from "@/data/marketplace";
import { routes } from "@/routes/paths";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const moduleIcons: Record<string, typeof ShieldCheck> = {
  "object-detection": Boxes,
  "accident-detection": TriangleAlert,
};

export function PurchasedModules() {
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  const trialEndsAt = useSubscriptionStore((state) => state.trialEndsAt);
  const activeModules = marketplaceModules.filter((module) => subscribedIds.includes(module.id));

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="sr-only"><h2>Active Modules</h2></div>
        <Link to={routes.marketplace}><Button><PackagePlus className="h-4 w-4" aria-hidden="true" />Browse Modules</Button></Link>
      </CardHeader>
      <CardContent className="grid gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
        {activeModules.map((module) => {
          const Icon = moduleIcons[module.id] ?? ShieldCheck;
          return <div key={module.id} className="rounded-lg border border-borderSubtle bg-[#0b0f14]/95 p-6"><div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#161b2a] text-cyan-100"><Icon className="h-6 w-6" aria-hidden="true" /></span><Badge variant="success" className="uppercase tracking-wider">Trial active</Badge></div><h3 className="mt-6 text-lg font-semibold text-white">{module.name}</h3><p className="mt-2 text-sm text-slate-400">30-day trial · Ends {trialEndsAt[module.id] ? new Date(trialEndsAt[module.id]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "soon"}</p></div>;
        })}
        {activeModules.length === 0 ? <div className="rounded-lg border border-dashed border-borderSubtle p-10 text-center md:col-span-2 xl:col-span-3"><h3 className="font-semibold text-white">No active modules</h3><p className="mt-2 text-sm text-slate-500">Object Detection and Accident Detection remain inactive until you start a trial.</p></div> : null}
      </CardContent>
    </Card>
  );
}
