import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAssetRegistryStore } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function App() {
  const userId = useAuthStore((state) => state.user?.id);
  const initialize = useAuthStore((state) => state.initialize);
  const syncAssets = useAssetRegistryStore((state) => state.syncAssets);
  const clearAssets = useAssetRegistryStore((state) => state.clearAssets);
  const syncSubscriptions = useSubscriptionStore((state) => state.syncSubscriptions);
  const clearSubscriptions = useSubscriptionStore((state) => state.clearSubscriptions);

  useEffect(() => { void initialize(); }, [initialize]);
  useEffect(() => {
    if (userId) { void syncAssets(); void syncSubscriptions(); }
    else { clearAssets(); clearSubscriptions(); }
  }, [userId, syncAssets, syncSubscriptions, clearAssets, clearSubscriptions]);

  return <Outlet />;
}
