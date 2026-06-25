import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { EventTable } from "@/components/dashboard/EventTable";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LiveCameraPanel } from "@/components/dashboard/LiveCameraPanel";
import { dashboardKpis } from "@/data/dashboard";

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <DashboardTopbar />
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar />
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dashboardKpis.map((metric) => (
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
