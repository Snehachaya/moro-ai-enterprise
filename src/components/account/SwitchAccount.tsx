import { LogOut, Repeat2, ShieldAlert, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { accountProfile } from "@/data/account";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

export function SwitchAccount() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return (
    <section className="space-y-5">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Switch Account</h2>
          <p className="mt-1 text-sm text-slate-500">Manage workspace access without leaving the command center.</p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-cyan-300/20 bg-accentSoft p-5">
            <Repeat2 className="h-6 w-6 text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm text-cyan-100/80">Current Active Account</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">{accountProfile.workspace}</h3>
          </div>
          <div className="rounded-xl border border-borderSubtle bg-white/[0.03] p-5">
            <UserPlus className="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-white">Sign in with another account</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Switch to a different MoroAI identity or workspace.</p>
            <Button className="mt-5">Add another account</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-400/25 bg-rose-500/10">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 text-rose-200" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-white">Danger Zone</h3>
              <p className="mt-1 text-sm text-rose-100/70">Sign out of this browser and clear the active session.</p>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate(routes.login, { replace: true });
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
