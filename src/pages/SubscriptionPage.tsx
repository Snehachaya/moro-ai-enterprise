import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { billingSummary, purchasedModules } from "@/data/account";
import { marketplaceModules } from "@/data/marketplace";
import { routes } from "@/routes/paths";
import {
  getSelectedModules,
  useSubscriptionStore,
} from "@/store/subscriptionStore";

export function SubscriptionPage() {
  const selectedIds = useSubscriptionStore((state) => state.selectedIds);
  const removeModule = useSubscriptionStore((state) => state.removeModule);
  const selectedModules = getSelectedModules(selectedIds);
  const subscribedIds = useSubscriptionStore((state) => state.subscribedIds);
  const trialEndsAt = useSubscriptionStore((state) => state.trialEndsAt);
  const subscribeSelected = useSubscriptionStore((state) => state.subscribeSelected);
  const activeModuleIds = new Set(purchasedModules.map((module) => `${module.id}-detection`));
  const activeModules = marketplaceModules.filter((module) => activeModuleIds.has(module.id) || subscribedIds.includes(module.id));
  const isCheckoutMode = selectedModules.length > 0;
  const displayedModules = isCheckoutMode ? selectedModules : activeModules;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent">{isCheckoutMode ? "30-Day Trial" : "Active Subscription"}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {isCheckoutMode ? "Activate your free trial" : "Manage your MoroAI subscription"}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            {isCheckoutMode
              ? "Review the selected module and activate it for 30 days. No payment details are required."
              : "Review active modules, renewal details, and current enterprise billing for this workspace."}
          </p>
        </div>
        <Link to={routes.marketplace}>
          <Button variant="secondary">{isCheckoutMode ? "Back to marketplace" : "Buy more modules"}</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
          <h2 className="text-xl font-semibold text-white">{isCheckoutMode ? "Trial modules" : "Active modules"}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayedModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.id}
                  className="flex flex-col gap-4 rounded-xl border border-borderSubtle bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{module.name}</h3>
                        <Badge>{module.category}</Badge>
                        {!isCheckoutMode ? <Badge variant="success">Trial active</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
                      {!isCheckoutMode && trialEndsAt[module.id] ? <p className="mt-2 text-xs text-cyan-200">Trial ends {new Date(trialEndsAt[module.id]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p> : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-lg font-semibold text-white">Rs. {module.price.toLocaleString("en-IN")}/mo</p>
                    {isCheckoutMode ? (
                      <Button variant="ghost" size="sm" onClick={() => removeModule(module.id)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><h2 className="text-xl font-semibold text-white">{isCheckoutMode ? "Trial summary" : "Current plan"}</h2></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {!isCheckoutMode ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Plan</span>
                    <span className="font-medium text-white">{billingSummary.currentPlan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Next renewal</span>
                    <span className="font-medium text-white">{billingSummary.nextRenewal}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between text-sm"><span className="text-slate-400">{isCheckoutMode ? "Trial period" : "Monthly billing"}</span><span className="font-medium text-white">{isCheckoutMode ? "30 days free" : billingSummary.monthlyBilling}</span></div>
              {isCheckoutMode ? (
                <>
                  <div className="border-t border-borderSubtle pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Due today</span>
                      <span className="text-3xl font-semibold text-emerald-200">₹0</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-borderSubtle pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Modules active</span>
                    <span className="text-3xl font-semibold text-white">{activeModules.length} / 6</span>
                  </div>
                </div>
              )}
            </div>

            {isCheckoutMode ? (
              <Button className="w-full" size="lg" onClick={subscribeSelected}>
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Start 30-day trial
              </Button>
            ) : (
              <Link to={routes.marketplace} className="block">
                <Button className="w-full" size="lg">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  Add or change modules
                </Button>
              </Link>
            )}

            <div className="rounded-xl border border-cyan-300/20 bg-accentSoft p-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm leading-6 text-cyan-50">
                  {isCheckoutMode
                    ? "No card or payment information is collected. Access activates immediately for 30 days."
                    : "Your active subscription is synced with Account Management and marketplace modules."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
