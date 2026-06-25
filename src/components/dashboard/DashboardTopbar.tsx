import { Bell, Settings, ShieldCheck } from "lucide-react";
import { ProfileMenu } from "@/components/account/ProfileMenu";
import { AppLogo } from "@/components/common/AppLogo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DashboardTopbar() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borderSubtle bg-surface/80 p-4 shadow-glass backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <AppLogo />
        <Badge variant="success" className="gap-2">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          System Online
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="secondary" size="sm" aria-label="Settings">
          <Settings className="h-4 w-4" aria-hidden="true" />
        </Button>
        <ProfileMenu />
      </div>
    </div>
  );
}
