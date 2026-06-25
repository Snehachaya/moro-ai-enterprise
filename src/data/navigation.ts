import { Gauge, LayoutGrid, UserCog } from "lucide-react";
import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", area: "dashboard", icon: Gauge },
  { label: "Marketplace", path: "/marketplace", area: "marketplace", icon: LayoutGrid },
];

export const accountNavigation: NavigationItem[] = [
  { label: "Account Management", path: "/account", area: "account", icon: UserCog },
];
