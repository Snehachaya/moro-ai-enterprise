import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ShoppingBag, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import {
  getSelectedModules,
  getSubscriptionTotal,
  useSubscriptionStore,
} from "@/store/subscriptionStore";

export function SubscriptionDrawer() {
  const selectedIds = useSubscriptionStore((state) => state.selectedIds);
  const drawerOpen = useSubscriptionStore((state) => state.drawerOpen);
  const setDrawerOpen = useSubscriptionStore((state) => state.setDrawerOpen);
  const removeModule = useSubscriptionStore((state) => state.removeModule);
  const clearCart = useSubscriptionStore((state) => state.clearCart);
  const selectedModules = getSelectedModules(selectedIds);
  const total = getSubscriptionTotal(selectedModules);

  return (
    <AnimatePresence initial={false}>
      {drawerOpen ? (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.22 }}
          className="lg:sticky lg:top-24"
        >
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <Badge variant="accent">Subscription</Badge>
                <h2 className="mt-3 text-lg font-semibold text-white">Summary</h2>
              </div>
              <Button variant="ghost" size="sm" aria-label="Hide summary" onClick={() => setDrawerOpen(false)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {selectedModules.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {selectedModules.map((module) => (
                      <div key={module.id} className="rounded-xl border border-borderSubtle bg-white/[0.03] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">{module.name}</p>
                            <p className="mt-1 text-sm text-slate-500">₹{module.price.toLocaleString("en-IN")}/month</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeModule(module.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-borderSubtle pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Monthly total</span>
                      <span className="text-2xl font-semibold text-white">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <Link to={routes.subscription} className="mt-5 block">
                      <Button className="w-full">
                        Continue checkout
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Button variant="ghost" className="mt-2 w-full" onClick={clearCart}>
                      Clear cart
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-borderSubtle p-6 text-center">
                  <ShoppingBag className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-white">Your cart is empty</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Add modules to calculate your subscription.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.aside>
      ) : (
        <Button className="fixed bottom-24 right-4 z-40 lg:bottom-8" onClick={() => setDrawerOpen(true)}>
          Open summary
        </Button>
      )}
    </AnimatePresence>
  );
}
