import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { EventTable } from "@/components/dashboard/EventTable";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LiveCameraPanel } from "@/components/dashboard/LiveCameraPanel";
import { dashboardKpis } from "@/data/dashboard";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function DashboardPage() {
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
        <DashboardSidebar />
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {visibleKpis.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>
          <LiveCameraPanel />
          <EventTable />
        </section>
      </div>
      <DashboardFooter />
    </div>
  );
}
