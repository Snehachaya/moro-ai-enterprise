import { useEffect, useRef, useState, type FormEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ArrowLeft, Camera, Check, Crop, Database, ImagePlus, Loader2, Pencil, RefreshCw, Trash2, X } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cropImage, extractEmbedding, imageFromDataUrl, normalizeObjectType, optimizeReferenceImage } from "@/lib/ownerIdentification";
import { routes } from "@/routes/paths";
import { useAssetRegistryStore } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

type FormValues = { category: "asset" | "person"; name: string; identityId: string; objectType: string };
const emptyForm: FormValues = { category: "asset", name: "", identityId: "", objectType: "" };

export function AssetRegistrationPage() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("object-detection"));
  const assets = useAssetRegistryStore((state) => state.assets);
  const addAsset = useAssetRegistryStore((state) => state.addAsset);
  const updateAsset = useAssetRegistryStore((state) => state.updateAsset);
  const removeAsset = useAssetRegistryStore((state) => state.removeAsset);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [images, setImages] = useState<string[]>([]);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  if (!subscribed) return <Navigate to={routes.assetOwnerIdentification} replace />;

  async function startCamera(selectedFacingMode = facingMode) {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: selectedFacingMode } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraOn(true); setError("");
    } catch { setError("Camera access was blocked. Allow camera access in your browser settings and try again."); }
  }

  function switchCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    if (cameraOn) void startCamera(next);
  }

  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = Math.round(640 * video.videoHeight / video.videoWidth);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImages((current) => current.length < 5 ? [...current, canvas.toDataURL("image/jpeg", 0.78)] : current);
  }

  function resetForm() { setValues(emptyForm); setImages([]); setEditingId(null); setError(""); }
  function edit(id: string) {
    const item = assets.find((asset) => asset.id === id); if (!item) return;
    const category = item.category ?? (normalizeObjectType(item.objectType) === "person" ? "person" : "asset");
    setValues({ category, name: item.assetName || item.ownerName, identityId: item.assetId, objectType: item.objectType });
    setImages(item.images?.length ? item.images : item.image ? [item.image] : []); setEditingId(id); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function applyCrop() {
    if (cropIndex === null || !cropPixels) return;
    const cropped = await cropImage(images[cropIndex], cropPixels);
    setImages((current) => current.map((item, index) => index === cropIndex ? cropped : item));
    setCropIndex(null); setCrop({ x: 0, y: 0 }); setZoom(1);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!images.length) { setError("Capture or upload at least one clear reference image."); return; }
    setSaving(true); setError("");
    try {
      const previous = editingId ? assets.find((asset) => asset.id === editingId) : undefined;
      const oldImages = previous?.images?.length ? previous.images : previous?.image ? [previous.image] : [];
      const oldEmbeddings = previous?.embeddings?.length ? previous.embeddings : previous?.embedding ? [previous.embedding] : [];
      const optimizedImages = await Promise.all(images.slice(0, 5).map((source, index) => source === oldImages[index] ? source : optimizeReferenceImage(source)));
      const embeddings = await Promise.all(optimizedImages.map(async (source, index) => source === oldImages[index] && oldEmbeddings[index]?.length ? oldEmbeddings[index] : extractEmbedding(await imageFromDataUrl(source))));
      const record = { category: values.category, ownerName: values.name, employeeId: "", department: "", objectType: normalizeObjectType(values.objectType), assetName: values.name, assetId: values.identityId, image: optimizedImages[0], images: optimizedImages, embedding: embeddings[0], embeddings };
      if (editingId) await updateAsset(editingId, record); else await addAsset(record);
      resetForm();
    } catch { setError("The identification model could not process these images. Try clear, well-lit images."); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-7xl space-y-6 pb-12">
    <Link to={routes.assetOwnerIdentification}><Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back to module</Button></Link>
    <div><Badge variant="accent">Subscriber workspace</Badge><h1 className="mt-4 text-4xl font-semibold text-white">Asset and person registration</h1><p className="mt-3 text-slate-400">Register or edit an identity with multiple cropped reference images.</p></div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card><CardContent><h2 className="text-xl font-semibold text-white">Reference images</h2><div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40"><video ref={videoRef} className="aspect-video w-full object-cover" muted autoPlay playsInline /></div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={cameraOn ? capture : () => void startCamera()} disabled={images.length >= 5}><Camera className="h-4 w-4" />{cameraOn ? "Capture another" : `Open ${facingMode === "user" ? "front" : "rear"} camera`}</Button><Button variant="secondary" onClick={switchCamera}><RefreshCw className="h-4 w-4" />{facingMode === "environment" ? "Use front" : "Use rear"}</Button><label className={`inline-flex h-10 items-center gap-2 rounded-lg border border-borderSubtle bg-white/5 px-4 text-sm font-semibold text-slate-100 ${images.length >= 5 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/10"}`}><ImagePlus className="h-4 w-4" />Upload images<input multiple disabled={images.length >= 5} type="file" accept="image/*" className="sr-only" onChange={(event) => { const remaining = 5 - images.length; for (const file of Array.from(event.target.files ?? []).slice(0, remaining)) { const reader = new FileReader(); reader.onload = () => setImages((current) => current.length < 5 ? [...current, String(reader.result)] : current); reader.readAsDataURL(file); } event.target.value = ""; }} /></label></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={`${image.slice(-20)}-${index}`} className="relative overflow-hidden rounded-xl border border-white/10"><img src={image} alt={`Reference ${index + 1}`} className="aspect-square w-full object-cover" /><div className="absolute inset-x-1 bottom-1 flex justify-between"><Button size="sm" variant="secondary" onClick={() => setCropIndex(index)}><Crop className="h-3.5 w-3.5" />Crop</Button><Button size="sm" variant="danger" aria-label={`Remove image ${index + 1}`} onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>)}</div><p className="mt-3 text-xs text-slate-500">{images.length}/5 reference images. Images are optimized for mobile before saving.</p></CardContent></Card>
      <Card><CardContent><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">{editingId ? "Edit registration" : "Registration details"}</h2>{editingId ? <Button variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4" />Cancel</Button> : null}</div><form className="mt-5 grid gap-4" onSubmit={submit}><fieldset><legend className="mb-2 text-sm text-slate-300">Register as</legend><div className="grid grid-cols-2 gap-3">{(["asset", "person"] as const).map((category) => <button key={category} type="button" onClick={() => setValues((current) => ({ ...current, category, objectType: category === "person" ? "person" : current.objectType === "person" ? "" : current.objectType }))} className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition ${values.category === category ? "border-cyan-300 bg-cyan-400/10 text-cyan-100" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>{category}</button>)}</div></fieldset>{[["name", values.category === "person" ? "Person name" : "Asset name"], ["identityId", values.category === "person" ? "Person ID" : "Asset ID"], ["objectType", "Type"]].map(([field, label]) => <label key={field} className="text-sm text-slate-300"><span className="mb-2 block">{label}</span><Input value={values[field as keyof FormValues]} placeholder={field === "objectType" ? values.category === "person" ? "person" : "laptop, cell phone, chair..." : undefined} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} required /></label>)}<Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}{saving ? "Creating visual identities..." : editingId ? "Save changes" : `Register ${values.category}`}</Button>{error ? <p className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}</form></CardContent></Card>
    </div>
    <Card><CardContent><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Shared assets and people</h2><Badge variant="success">{assets.length} organization-wide</Badge></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">{asset.image ? <img src={asset.image} alt={asset.assetName} className="h-36 w-full object-cover" /> : null}<div className="p-4"><div className="flex justify-between gap-3"><div><Badge variant="neutral">{asset.category ?? (asset.objectType === "person" ? "person" : "asset")}</Badge><p className="mt-2 font-semibold text-white">{asset.assetName}</p></div><div className="flex"><Button variant="ghost" size="sm" aria-label={`Edit ${asset.assetName}`} onClick={() => edit(asset.id)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" aria-label={`Remove ${asset.assetName}`} onClick={() => void removeAsset(asset.id)}><Trash2 className="h-4 w-4" /></Button></div></div><p className="mt-3 text-xs text-slate-500">{asset.assetId} · {asset.objectType}</p><p className="mt-2 text-xs text-slate-500">{asset.embeddings?.length ?? (asset.embedding ? 1 : 0)} visual reference(s)</p></div></article>)}</div>{assets.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-500">No shared assets or people registered yet.</p> : null}</CardContent></Card>
    {cropIndex !== null ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"><div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold text-white">Crop reference image</h2><p className="mt-1 text-sm text-slate-400">Drag the image and zoom until the asset or person fills the frame.</p></div><Button variant="ghost" onClick={() => setCropIndex(null)}><X className="h-4 w-4" /></Button></div><div className="relative mt-5 h-[55vh] max-h-[520px] overflow-hidden rounded-xl bg-black"><Cropper image={images[cropIndex]} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setCropPixels(pixels)} /></div><label className="mt-5 block text-sm text-slate-300">Zoom<input className="mt-2 w-full accent-cyan-300" type="range" min={1} max={3} step={0.05} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label><div className="mt-5 flex justify-end gap-3"><Button variant="secondary" onClick={() => setCropIndex(null)}>Cancel</Button><Button onClick={applyCrop}><Check className="h-4 w-4" />Apply crop</Button></div></div></div> : null}
  </div>;
}
