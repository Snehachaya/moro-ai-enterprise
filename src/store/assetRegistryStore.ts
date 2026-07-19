import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RegisteredAsset {
  id: string;
  ownerName: string;
  employeeId: string;
  department: string;
  objectType: string;
  assetName: string;
  assetId: string;
  image?: string;
  createdAt: string;
}

interface AssetRegistryState {
  assets: RegisteredAsset[];
  addAsset: (asset: Omit<RegisteredAsset, "id" | "createdAt">) => void;
  removeAsset: (id: string) => void;
}

export const useAssetRegistryStore = create<AssetRegistryState>()(persist((set) => ({
  assets: [],
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, { ...asset, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] })),
  removeAsset: (id) => set((state) => ({ assets: state.assets.filter((asset) => asset.id !== id) })),
}), { name: "moroai-asset-registry" }));
