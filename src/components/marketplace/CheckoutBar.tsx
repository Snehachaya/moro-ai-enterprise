import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/routes/paths";
import { getSelectedModules, getSubscriptionTotal, useSubscriptionStore } from "@/store/subscriptionStore";

export function CheckoutBar() {
  const selectedIds = useSubscriptionStore((state) => state.selectedIds);
  const selectedModules = getSelectedModules(selectedIds);
  const total = getSubscriptionTotal(selectedModules);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-borderSubtle bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:left-72 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedModules.length > 0 ? `${selectedModules.length} module${selectedModules.length === 1 ? "" : "s"} selected` : "Empty cart"}
            </p>
            <p className="text-sm text-slate-500">
              {selectedModules.length > 0 ? `₹${total.toLocaleString("en-IN")}/month estimated total` : "Choose modules to start checkout."}
            </p>
          </div>
        </div>
        <Link to={routes.subscription}>
          <Button className="w-full sm:w-auto" disabled={selectedModules.length === 0}>
            Review checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
