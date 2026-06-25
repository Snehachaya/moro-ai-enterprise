import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { dashboardEvents, type ActivityEvent } from "@/data/dashboard";

const priorityVariant: Record<ActivityEvent["priority"], "neutral" | "success" | "warning" | "danger" | "accent"> = {
  low: "success",
  medium: "accent",
  high: "warning",
  critical: "danger",
};

export function EventTable() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-white">Recent AI Events</h2>
        <p className="mt-1 text-sm text-slate-500">Timestamped detections from the live surveillance fabric.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-borderSubtle">
          <thead className="bg-white/[0.03]">
            <tr>
              {["Timestamp", "Event Module", "Description", "Location", "Priority", "View"].map((header) => (
                <th key={header} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle">
            {dashboardEvents.map((event) => (
              <tr key={event.id} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4 text-sm font-medium text-slate-300">{event.timestamp}</td>
                <td className="px-5 py-4 text-sm text-slate-300">{event.module}</td>
                <td className="max-w-sm px-5 py-4 text-sm text-slate-400">{event.description}</td>
                <td className="px-5 py-4 text-sm text-slate-300">{event.location}</td>
                <td className="px-5 py-4">
                  <Badge variant={priorityVariant[event.priority]}>{event.priority}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Button variant="ghost" size="sm" aria-label={`View ${event.id}`}>
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
