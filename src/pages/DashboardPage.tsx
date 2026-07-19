import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { EventTable } from "@/components/dashboard/EventTable";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LiveCameraPanel } from "@/components/dashboard/LiveCameraPanel";
import { dashboardKpis } from "@/data/dashboard";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { LiveObjectDetectionPage } from "@/pages/LiveObjectDetectionPage";
import { Card, CardContent } from "@/components/ui/Card";

export function DashboardPage() {
  const [selectedModule, setSelectedModule] = useState("object");
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  const visibleKpis = dashboardKpis.map((metric) => {
    const available = metric.id === "object" || metric.id === "accident";
    const active = available && subscribedIds.includes(`${metric.id}-detection`);
    return { ...metric, value: active ? metric.value : "0", status: active ? "ACTIVE" : available ? "INACTIVE" : "COMING SOON", severity: active ? metric.severity : "cleared" as const };
  });
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <DashboardTopbar />
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar selectedId={selectedModule} onSelect={setSelectedModule} />
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {visibleKpis.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>
          {selectedModule === "object" && subscribedIds.includes("object-detection") ? <LiveObjectDetectionPage embedded /> : selectedModule === "object" ? <Card><CardContent><h2 className="text-xl font-semibold text-white">Object Detection is inactive</h2><p className="mt-2 text-sm text-slate-400">Start the Object Detection trial to open the live camera from this dashboard.</p></CardContent></Card> : <LiveCameraPanel />}
          <EventTable />
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}
import { useState } from "react";
