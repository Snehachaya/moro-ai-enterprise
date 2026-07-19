import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Camera, Database, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { extractEmbedding, imageFromDataUrl, normalizeObjectType } from "@/lib/ownerIdentification";
import { routes } from "@/routes/paths";
import { useAssetRegistryStore } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function AssetRegistrationPage() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("object-detection"));
  const assets = useAssetRegistryStore((state) => state.assets);
  const addAsset = useAssetRegistryStore((state) => state.addAsset);
  const removeAsset = useAssetRegistryStore((state) => state.removeAsset);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  if (!subscribed) return <Navigate to={routes.assetOwnerIdentification} replace />;

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraOn(true); setError("");
    } catch { setError("Camera access was blocked. Allow camera access in your browser settings and try again."); }
  }

  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = Math.round(640 * video.videoHeight / video.videoWidth);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/jpeg", 0.82));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!image) { setError("Capture or upload a clear reference image before registering."); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true); setError("");
    try {
      const embedding = await extractEmbedding(await imageFromDataUrl(image));
      addAsset({
        ownerName: String(data.get("ownerName")), employeeId: String(data.get("employeeId")),
        department: String(data.get("department")), objectType: normalizeObjectType(String(data.get("objectType"))),
        assetName: String(data.get("assetName")), assetId: String(data.get("assetId")), image, embedding,
      });
      form.reset(); setImage("");
    } catch { setError("The identification model could not process this image. Try another clear image."); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-7xl space-y-6 pb-12">
    <Link to={routes.assetOwnerIdentification}><Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back to module</Button></Link>
    <div><Badge variant="accent">Subscriber workspace</Badge><h1 className="mt-4 text-4xl font-semibold text-white">Asset and person registration</h1><p className="mt-3 text-slate-400">Enroll owner details and a reference image for on-device visual identification.</p></div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card><CardContent><h2 className="text-xl font-semibold text-white">Reference image</h2><div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40"><video ref={videoRef} className="aspect-video w-full object-cover" muted autoPlay playsInline /></div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={cameraOn ? capture : startCamera}><Camera className="h-4 w-4" />{cameraOn ? "Capture image" : "Open webcam"}</Button><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-borderSubtle bg-white/5 px-4 text-sm font-semibold text-slate-100 hover:bg-white/10"><ImagePlus className="h-4 w-4" />Upload image<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setImage(String(reader.result)); reader.readAsDataURL(file); } }} /></label></div>{image ? <img src={image} alt="Reference preview" className="mt-4 max-h-56 rounded-xl border border-cyan-300/20 object-cover" /> : null}</CardContent></Card>
      <Card><CardContent><h2 className="text-xl font-semibold text-white">Owner and identity details</h2><form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit}>{[["ownerName", "Owner name"], ["employeeId", "Employee ID"], ["department", "Department"], ["objectType", "Type (person, laptop, cell phone...)"], ["assetName", "Asset or person name"], ["assetId", "Asset / Person ID"]].map(([name, label]) => <label key={name} className="text-sm text-slate-300"><span className="mb-2 block">{label}</span><Input name={name} required /></label>)}<Button type="submit" className="sm:col-span-2" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}{saving ? "Creating visual identity..." : "Register asset or person"}</Button>{error ? <p className="sm:col-span-2 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}</form></CardContent></Card>
    </div>
    <Card><CardContent><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Registered assets and people</h2><Badge variant="success">{assets.length} enrolled</Badge></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">{asset.image ? <img src={asset.image} alt={asset.assetName} className="h-36 w-full object-cover" /> : null}<div className="p-4"><div className="flex justify-between gap-3"><div><p className="font-semibold text-white">{asset.assetName}</p><p className="mt-1 text-sm text-cyan-100">{asset.ownerName}</p></div><Button variant="ghost" size="sm" aria-label={`Remove ${asset.assetName}`} onClick={() => removeAsset(asset.id)}><Trash2 className="h-4 w-4" /></Button></div><p className="mt-3 text-xs text-slate-500">{asset.objectType} · {asset.assetId} · {asset.department}</p><p className="mt-2 text-xs text-slate-500">{asset.embedding?.length ? "Visual identity ready" : "Re-register to enable visual matching"}</p></div></article>)}</div>{assets.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-500">No assets or people registered yet.</p> : null}</CardContent></Card>
  </div>;
}
