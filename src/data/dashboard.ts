export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
}

export interface ActivityEvent {
  id: string;
  camera: string;
  module: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "open" | "reviewing" | "resolved";
}

export const kpiMetrics: KpiMetric[] = [
  { id: "cameras", label: "Active Cameras", value: "1,284", trend: "+8.2% this week" },
  { id: "detections", label: "Detections", value: "48,392", trend: "+12.4% this month" },
  { id: "alerts", label: "Priority Alerts", value: "37", trend: "-9.1% today" },
  { id: "uptime", label: "System Uptime", value: "99.98%", trend: "SLA healthy" },
];

export const activityEvents: ActivityEvent[] = [
  {
    id: "evt-1001",
    camera: "North Gate CAM-04",
    module: "Human Detection",
    severity: "medium",
    timestamp: "2026-06-25T03:18:00+05:30",
    status: "reviewing",
  },
  {
    id: "evt-1002",
    camera: "Warehouse Bay CAM-11",
    module: "Object Detection",
    severity: "low",
    timestamp: "2026-06-25T03:09:00+05:30",
    status: "resolved",
  },
  {
    id: "evt-1003",
    camera: "Parking East CAM-02",
    module: "Threat Detection",
    severity: "critical",
    timestamp: "2026-06-25T02:54:00+05:30",
    status: "open",
  },
];
