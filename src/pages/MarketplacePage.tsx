import { BundleCard } from "@/components/marketplace/BundleCard";
import { CheckoutBar } from "@/components/marketplace/CheckoutBar";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { ModulePlanCard } from "@/components/marketplace/ModulePlanCard";
import { SubscriptionDrawer } from "@/components/marketplace/SubscriptionDrawer";
import { marketplaceBundles, marketplaceModules } from "@/data/marketplace";

const standaloneModules = marketplaceModules.filter((module) => !module.highlighted);

export function MarketplacePage() {
  return (
    <div className="pb-28">
      <div className="mx-auto max-w-7xl space-y-8">
        <MarketplaceHeader />
        {marketplaceBundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-5 md:grid-cols-2">
            {standaloneModules.map((module) => (
              <ModulePlanCard key={module.id} module={module} />
            ))}
          </section>
          <SubscriptionDrawer />
        </div>
      </div>
      <CheckoutBar />
    </div>
  );
}
