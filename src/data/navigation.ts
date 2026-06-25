import { Camera, CreditCard, Gauge, LayoutGrid, LockKeyhole, Settings, Shield, Users } from "lucide-react";
import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", area: "dashboard", icon: Gauge },
  { label: "Devices", path: "/devices", area: "dashboard", icon: Camera },
  { label: "Marketplace", path: "/marketplace", area: "marketplace", icon: LayoutGrid },
];

export const accountNavigation: NavigationItem[] = [
  { label: "Profile", path: "/account/profile", area: "account", icon: Shield },
  { label: "Billing", path: "/account/billing", area: "account", icon: CreditCard },
  { label: "Users", path: "/account/users", area: "account", icon: Users },
  { label: "RBAC", path: "/account/rbac", area: "account", icon: LockKeyhole },
  { label: "Settings", path: "/account/settings", area: "account", icon: Settings },
];
