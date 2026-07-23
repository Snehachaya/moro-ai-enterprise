export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  status: string;
  severity: "normal" | "tracking" | "critical" | "cleared" | "resolving";
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  module: string;
  description: string;
  location: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface CameraDetection {
  id: string;
  label: string;
  confidence?: string;
  className: string;
}

export interface CameraMetric {
  label: string;
  value: string;
}

export interface ModuleNavItem {
  id: string;
  label: string;
  status: string;
  count: number;
  route: string;
}

export const moduleNavItems: ModuleNavItem[] = [
  { id: "object", label: "Object", status: "TRACKING", count: 4912, route: "/modules/object-detection" },
  { id: "accident", label: "Accident", status: "RESOLVING", count: 2, route: "/modules/accident-detection" },
];

export const dashboardKpis: KpiMetric[] = [
  { id: "object", label: "Object", value: "4912", status: "TRACKING", severity: "tracking" },
  { id: "accident", label: "Accident", value: "2", status: "RESOLVING", severity: "resolving" },
];

export const cameraDetections: CameraDetection[] = [
  {
    id: "package",
    label: "Package",
    confidence: "92.1%",
    className: "left-[58%] top-[58%] h-[16%] w-[18%] border-amber-300 text-amber-100",
  },
  {
    id: "vehicle",
    label: "Vehicle Impact",
    confidence: "96.3%",
    className: "left-[28%] top-[48%] h-[24%] w-[32%] border-emerald-300 text-emerald-100",
  },
];

export const cameraMetrics: CameraMetric[] = [
  { label: "Latency", value: "38ms" },
  { label: "Encoding", value: "H.265" },
  { label: "Bitrate", value: "12.8 Mbps" },
];

export const dashboardEvents: ActivityEvent[] = [
  {
    id: "evt-001",
    timestamp: "03:43:02",
    module: "Object",
    description: "Unattended package tracked near loading zone.",
    location: "Warehouse Bay 02",
    priority: "medium",
  },
  {
    id: "evt-002",
    timestamp: "03:46:09",
    module: "Accident",
    description: "Slip-and-fall risk event resolving.",
    location: "Lobby Entrance",
    priority: "high",
  },
];

export const kpiMetrics = dashboardKpis;

export const activityEvents = dashboardEvents.map((event) => ({
  id: event.id,
  camera: event.location,
  module: event.module,
  severity: event.priority,
  timestamp: event.timestamp,
  status: event.priority === "critical" ? "open" : event.priority === "high" ? "reviewing" : "resolved",
}));
