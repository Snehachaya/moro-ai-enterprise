import { LogOut, Network, ShieldAlert, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { accountProfile } from "@/data/account";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

export function SwitchAccount() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return (
    <section className="space-y-16">
      <Card className="rounded-lg border-borderSubtle bg-[#0b0f14]/95">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#20243a] text-cyan-100 shadow-[0_0_24px_rgba(6,182,212,0.16)]">
              <Network className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Current Active Account</p>
              <h3 className="mt-2 text-lg font-medium text-white">{accountProfile.workspace}</h3>
            </div>
          </div>
          <Button variant="secondary" className="justify-center px-8">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Sign In With Another Account
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-rose-400/25 bg-rose-500/10">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-rose-200" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-medium text-rose-100">Danger Zone</h3>
              <p className="mt-2 text-sm text-rose-100/70">
                You will be redirected to the home page. All active sessions on this device will be terminated.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate(routes.home, { replace: true });
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
