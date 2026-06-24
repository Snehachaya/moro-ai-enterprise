import { Outlet } from "react-router-dom";
import { AppLogo } from "@/components/common/AppLogo";
import { Card } from "@/components/ui/Card";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.65fr)]">
      <aside className="hidden border-r border-borderSubtle bg-surface/40 p-8 lg:flex lg:flex-col lg:justify-between">
        <AppLogo />
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Enterprise access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Secure operations begin with trusted identity.
          </h1>
          <p className="mt-4 leading-7 text-slate-400">
            Centralized access for surveillance teams, administrators, and incident responders.
          </p>
        </div>
      </aside>
      <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <Outlet />
        </Card>
      </main>
    </div>
  );
}
