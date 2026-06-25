import { Link } from "react-router-dom";
import { CheckCircle2, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { routes } from "@/routes/paths";
import {
  getSelectedModules,
  getSubscriptionTotal,
  useSubscriptionStore,
} from "@/store/subscriptionStore";

export function SubscriptionPage() {
  const selectedIds = useSubscriptionStore((state) => state.selectedIds);
  const removeModule = useSubscriptionStore((state) => state.removeModule);
  const selectedModules = getSelectedModules(selectedIds);
  const total = getSubscriptionTotal(selectedModules);
  const taxEstimate = Math.round(total * 0.18);
  const dueToday = total + taxEstimate;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent">Subscription Checkout</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">Review your MoroAI plan</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Confirm selected modules, monthly total, and billing readiness before provisioning your workspace.
          </p>
        </div>
        <Link to={routes.marketplace}>
          <Button variant="secondary">Back to marketplace</Button>
        </Link>
      </div>

      {selectedModules.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Selected modules</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div key={module.id} className="flex flex-col gap-4 rounded-xl border border-borderSubtle bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{module.name}</h3>
                          <Badge>{module.category}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="text-lg font-semibold text-white">₹{module.price.toLocaleString("en-IN")}/mo</p>
                      <Button variant="ghost" size="sm" onClick={() => removeModule(module.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Billing summary</h2>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monthly modules</span>
                  <span className="font-medium text-white">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST estimate</span>
                  <span className="font-medium text-white">₹{taxEstimate.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-borderSubtle pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Due today</span>
                    <span className="text-3xl font-semibold text-white">₹{dueToday.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
                Proceed to payment
              </Button>
              <div className="rounded-xl border border-cyan-300/20 bg-accentSoft p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-sm leading-6 text-cyan-50">Encrypted checkout prepared for future payment gateway integration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-500" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">No modules selected</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Your subscription cart is empty. Choose AI modules from the marketplace to continue checkout.
            </p>
            <Link to={routes.marketplace} className="mt-6 inline-block">
              <Button>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Choose modules
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
