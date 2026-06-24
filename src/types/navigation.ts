import type { LucideIcon } from "lucide-react";

export type RouteArea = "public" | "auth" | "dashboard" | "account" | "marketplace" | "module";

export interface NavigationItem {
  label: string;
  path: string;
  area: RouteArea;
  icon?: LucideIcon;
}
