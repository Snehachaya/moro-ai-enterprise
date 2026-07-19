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
  { id: "human", label: "Human", status: "ACTIVE", count: 1284, route: "/modules/human-detection" },
  { id: "object", label: "Object", status: "TRACKING", count: 4912, route: "/modules/object-detection" },
  { id: "owner", label: "Asset Owner", status: "MATCHING", count: 128, route: "/modules/asset-owner-identification" },
  { id: "threat", label: "Threat", status: "CRITICAL", count: 12, route: "/modules/threat-detection" },
  { id: "weapon", label: "Weapon", status: "CLEARED", count: 0, route: "/modules/weapon-detection" },
  { id: "accident", label: "Accident", status: "RESOLVING", count: 2, route: "/modules/accident-detection" },
];

export const dashboardKpis: KpiMetric[] = [
  { id: "human", label: "Human", value: "1284", status: "ACTIVE", severity: "normal" },
  { id: "object", label: "Object", value: "4912", status: "TRACKING", severity: "tracking" },
  { id: "threat", label: "Threat", value: "12", status: "CRITICAL", severity: "critical" },
  { id: "weapon", label: "Weapon", value: "0", status: "CLEARED", severity: "cleared" },
  { id: "accident", label: "Accident", value: "2", status: "RESOLVING", severity: "resolving" },
];

export const cameraDetections: CameraDetection[] = [
  {
    id: "person",
    label: "Person",
    confidence: "98.4%",
    className: "left-[36%] top-[20%] h-[44%] w-[18%] border-cyan-300 text-cyan-100",
  },
  {
    id: "package",
    label: "Package",
    confidence: "92.1%",
    className: "left-[58%] top-[58%] h-[16%] w-[18%] border-amber-300 text-amber-100",
  },
  {
    id: "unauthorized",
    label: "Unauthorized Access",
    className: "left-[18%] top-[32%] h-[30%] w-[22%] border-rose-400 text-rose-100",
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
    timestamp: "03:42:18",
    module: "Human",
    description: "Known employee verified at south gate.",
    location: "CAM_04_SOUTH_GATE",
    priority: "low",
  },
  {
    id: "evt-002",
    timestamp: "03:43:02",
    module: "Object",
    description: "Unattended package tracked near loading zone.",
    location: "Warehouse Bay 02",
    priority: "medium",
  },
  {
    id: "evt-003",
    timestamp: "03:44:31",
    module: "Threat",
    description: "Unauthorized access pattern detected.",
    location: "South Gate",
    priority: "critical",
  },
  {
    id: "evt-004",
    timestamp: "03:46:09",
    module: "Accident",
    description: "Slip-and-fall risk event resolving.",
    location: "Lobby Entrance",
    priority: "high",
  },
  {
    id: "evt-005",
    timestamp: "03:47:55",
    module: "Weapon",
    description: "No weapon signatures detected.",
    location: "Perimeter Scan",
    priority: "low",
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
