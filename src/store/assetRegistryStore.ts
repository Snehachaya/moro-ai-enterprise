import { create } from "zustand";
import { SHARED_ORGANIZATION_ID, supabase } from "@/lib/supabase";

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

type AssetInput = Omit<RegisteredAsset, "id" | "createdAt">;
interface AssetRegistryState {
  assets: RegisteredAsset[];
  loading: boolean;
  error: string;
  syncAssets: () => Promise<void>;
  clearAssets: () => void;
  addAsset: (asset: AssetInput) => Promise<void>;
  updateAsset: (id: string, asset: AssetInput) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
}

function sourceToBlob(source: string) {
  return fetch(source).then(async (response) => {
    if (!response.ok) throw new Error("Unable to read a reference image.");
    return response.blob();
  });
}

async function uploadImages(entityId: string, sources: string[]) {
  const paths: string[] = [];
  for (let index = 0; index < sources.length; index += 1) {
    const path = `${SHARED_ORGANIZATION_ID}/${entityId}/${index}.jpg`;
    const { error } = await supabase.storage.from("entity-images").upload(path, await sourceToBlob(sources[index]), { contentType: "image/jpeg", upsert: true });
    if (error) throw error;
    paths.push(path);
  }
  return paths;
}

async function signedImages(paths: string[]) {
  return Promise.all(paths.map(async (path) => {
    const { data, error } = await supabase.storage.from("entity-images").createSignedUrl(path, 3600);
    if (error) throw error;
    return data.signedUrl;
  }));
}

async function mapRows(rows: Array<Record<string, unknown>>): Promise<RegisteredAsset[]> {
  return Promise.all(rows.map(async (row) => {
    const paths = (row.image_paths as string[] | null) ?? [];
    const images = await signedImages(paths);
    const embeddings = (row.embeddings as number[][] | null) ?? [];
    return {
      id: String(row.id), category: row.category as "asset" | "person", ownerName: String(row.name), employeeId: "", department: "",
      objectType: String(row.object_type), assetName: String(row.name), assetId: String(row.identity_id), image: images[0], images,
      embedding: embeddings[0], embeddings, createdAt: String(row.created_at),
    };
  }));
}

async function saveAsset(asset: AssetInput, existingId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in before saving a registration.");
  const id = existingId ?? crypto.randomUUID();
  const images = asset.images?.length ? asset.images : asset.image ? [asset.image] : [];
  const imagePaths = await uploadImages(id, images);
  const payload = {
    id, organization_id: SHARED_ORGANIZATION_ID, created_by: user.id, category: asset.category ?? (asset.objectType === "person" ? "person" : "asset"),
    name: asset.assetName || asset.ownerName, identity_id: asset.assetId, object_type: asset.objectType, image_paths: imagePaths,
    embeddings: asset.embeddings?.length ? asset.embeddings : asset.embedding ? [asset.embedding] : [], updated_at: new Date().toISOString(),
  };
  const query = existingId ? supabase.from("registered_entities").update(payload).eq("id", id) : supabase.from("registered_entities").insert(payload);
  const { error } = await query;
  if (error) throw error;
}

async function fetchAssets() {
  const { data, error } = await supabase.from("registered_entities").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return mapRows((data ?? []) as Array<Record<string, unknown>>);
}

export const useAssetRegistryStore = create<AssetRegistryState>((set) => ({
  assets: [], loading: false, error: "",
  syncAssets: async () => {
    set({ loading: true, error: "" });
    try { set({ assets: await fetchAssets(), loading: false }); }
    catch (cause) { set({ loading: false, error: cause instanceof Error ? cause.message : "Unable to load shared registrations." }); }
  },
  clearAssets: () => set({ assets: [], error: "", loading: false }),
  addAsset: async (asset) => { await saveAsset(asset); set({ assets: await fetchAssets() }); },
  updateAsset: async (id, asset) => { await saveAsset(asset, id); set({ assets: await fetchAssets() }); },
  removeAsset: async (id) => {
    const current = useAssetRegistryStore.getState().assets.find((asset) => asset.id === id);
    const { error } = await supabase.from("registered_entities").delete().eq("id", id);
    if (error) throw error;
    if (current) {
      const count = current.images?.length ?? (current.image ? 1 : 0);
      if (count) await supabase.storage.from("entity-images").remove(Array.from({ length: count }, (_, index) => `${SHARED_ORGANIZATION_ID}/${id}/${index}.jpg`));
    }
    set({ assets: await fetchAssets() });
  },
}));
