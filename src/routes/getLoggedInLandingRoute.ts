import { purchasedModules } from "@/data/account";
import { routes } from "@/routes/paths";

export function getLoggedInLandingRoute() {
  return purchasedModules.length > 0 ? routes.dashboard : routes.marketplace;
}
