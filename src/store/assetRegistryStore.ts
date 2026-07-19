import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RegisteredAsset {
  id: string;
  category?: "asset" | "person";
  ownerName: string;
  employeeId: string;
  department: string;
  objectType: string;
  assetName: string;
  assetId: string;
  image?: string;
  images?: string[];
  embedding?: number[];
  embeddings?: number[][];
  createdAt: string;
}

interface AssetRegistryState {
  assets: RegisteredAsset[];
  addAsset: (asset: Omit<RegisteredAsset, "id" | "createdAt">) => void;
  updateAsset: (id: string, asset: Omit<RegisteredAsset, "id" | "createdAt">) => void;
  removeAsset: (id: string) => void;
}

export const useAssetRegistryStore = create<AssetRegistryState>()(persist((set) => ({
  assets: [],
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, { ...asset, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] })),
  updateAsset: (id, asset) => set((state) => ({ assets: state.assets.map((item) => item.id === id ? { ...item, ...asset } : item) })),
  removeAsset: (id) => set((state) => ({ assets: state.assets.filter((asset) => asset.id !== id) })),
}), { name: "moroai-asset-registry" }));
