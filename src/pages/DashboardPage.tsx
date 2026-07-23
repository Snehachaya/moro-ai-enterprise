import { useState } from "react";
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
import { AccidentDetectionConsole } from "@/components/modules/AccidentDetectionConsole";
import { Button } from "@/components/ui/Button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function DashboardPage() {
  const [selectedModule, setSelectedModule] = useState("object");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  const visibleKpis = dashboardKpis.map((metric) => {
    const available = metric.id === "object" || metric.id === "accident";
    const active = available && subscribedIds.includes(`${metric.id}-detection`);
    return { ...metric, value: active ? metric.value : "0", status: active ? "ACTIVE" : available ? "INACTIVE" : "COMING SOON", severity: active ? metric.severity : "cleared" as const };
  });
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <DashboardTopbar />
      <div className="flex justify-end">
        <Button variant="secondary" aria-expanded={sidebarVisible} onClick={() => setSidebarVisible((visible) => !visible)}>
          {sidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {sidebarVisible ? "Hide modules" : "Show modules"}
        </Button>
      </div>
      <div className={`grid gap-6 ${sidebarVisible ? "xl:grid-cols-[280px_minmax(0,1fr)]" : "grid-cols-1"}`}>
        {sidebarVisible ? <DashboardSidebar selectedId={selectedModule} onSelect={setSelectedModule} /> : null}
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleKpis.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>
          {selectedModule === "object" && subscribedIds.includes("object-detection") ? <LiveObjectDetectionPage embedded /> : selectedModule === "object" ? <Card><CardContent><h2 className="text-xl font-semibold text-white">Object Detection is inactive</h2><p className="mt-2 text-sm text-slate-400">Start the Object Detection trial to open the live camera from this dashboard.</p></CardContent></Card> : selectedModule === "accident" ? <AccidentDetectionConsole /> : <LiveCameraPanel />}
          <EventTable />
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}


