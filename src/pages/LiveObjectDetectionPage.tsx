import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Loader2, RefreshCw, ScanLine, StopCircle, UserRound } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cosineSimilarity, extractEmbedding, normalizeObjectType } from "@/lib/ownerIdentification";
import { routes } from "@/routes/paths";
import { useAssetRegistryStore, type RegisteredAsset } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface OwnerMatch { asset?: RegisteredAsset; similarity: number; status: "Known" | "Unknown" | "Identifying"; }
interface Detection { bbox: [number, number, number, number]; class: string; score: number; key: string; owner: OwnerMatch; }
type CameraStatus = "idle" | "requesting" | "loading-model" | "live" | "camera-only";

const PERSON_MATCH_THRESHOLD = 0.42;
const OBJECT_MATCH_THRESHOLD = 0.56;
const MAX_DETECTIONS = 5;
const LOWER_CONFIDENCE_CLASSES = new Set([
  "chair", "couch", "bed", "dining table", "refrigerator", "tv", "laptop",
]);

function minimumDetectionScore(className: string) {
  if (className === "person") return 0.55;
  if (LOWER_CONFIDENCE_CLASSES.has(className)) return 0.38;
  return 0.5;
}

function cameraErrorMessage(cause: unknown) {
  if (cause instanceof DOMException) {
    if (["NotAllowedError", "SecurityError"].includes(cause.name)) return "Camera permission was blocked. Allow camera access for this site, then try again.";
    if (["NotFoundError", "OverconstrainedError"].includes(cause.name)) return "No available camera was found on this device.";
    if (["NotReadableError", "AbortError"].includes(cause.name)) return "The camera is being used by another app. Close it and try again.";
  }
  return cause instanceof Error ? cause.message : "Unable to open the camera.";
}

function detectionKey(className: string, bbox: [number, number, number, number]) {
  const [x, y, width, height] = bbox;
  return `${className}:${Math.floor((x + width / 2) / 220)}:${Math.floor((y + height / 2) / 220)}:${Math.floor(Math.sqrt(width * height) / 180)}`;
}

async function identifyOwner(video: HTMLVideoElement, bbox: [number, number, number, number], objectType: string, assets: RegisteredAsset[]) {
  const [x, y, width, height] = bbox;
  const normalizedType = normalizeObjectType(objectType);
  const regions = normalizedType === "person"
    ? [[x, y, width, height], [x, y, width, Math.max(1, height * 0.55)]]
    : [[x, y, width, height]];
  const liveEmbeddings = await Promise.all(regions.map(async ([regionX, regionY, regionWidth, regionHeight]) => {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 224 / Math.max(regionWidth, regionHeight));
    canvas.width = Math.max(1, Math.round(regionWidth * scale)); canvas.height = Math.max(1, Math.round(regionHeight * scale));
    canvas.getContext("2d")?.drawImage(video, regionX, regionY, regionWidth, regionHeight, 0, 0, canvas.width, canvas.height);
    return extractEmbedding(canvas);
  }));
  const hasReferences = (asset: RegisteredAsset) => Boolean(asset.embeddings?.length || asset.embedding?.length);
  const typed = assets.filter((asset) => {
    const category = asset.category ?? (normalizeObjectType(asset.objectType) === "person" ? "person" : "asset");
    return hasReferences(asset) && (normalizedType === "person" ? category === "person" : normalizeObjectType(asset.objectType) === normalizedType);
  });
  const candidates = typed.length ? typed : assets.filter(hasReferences);
  let asset: RegisteredAsset | undefined;
  let similarity = 0;
  for (const candidate of candidates) {
    const references = candidate.embeddings?.length ? candidate.embeddings : candidate.embedding ? [candidate.embedding] : [];
    for (const reference of references) {
      for (const embedding of liveEmbeddings) {
        const score = cosineSimilarity(embedding, reference);
        if (score > similarity) { similarity = score; asset = candidate; }
      }
    }
  }
  const threshold = normalizedType === "person" ? PERSON_MATCH_THRESHOLD : OBJECT_MATCH_THRESHOLD;
  return similarity >= threshold ? { asset, similarity, status: "Known" as const } : { similarity, status: "Unknown" as const };
}

export function LiveObjectDetectionPage({ embedded = false }: { embedded?: boolean }) {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("object-detection"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef(0);
  const sessionRef = useRef(0);
  const matchesRef = useRef(new Map<string, OwnerMatch>());
  const pendingRef = useRef(new Set<string>());
  const lastOwnerScanRef = useRef(0);
  const lastOwnerMatchRef = useRef(new Map<string, number>());
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [frameSize, setFrameSize] = useState({ width: 1280, height: 720 });

  useEffect(() => () => {
    sessionRef.current += 1; cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);
  if (!subscribed) return <Navigate to={routes.assetOwnerIdentification} replace />;

  async function start(selectedFacingMode = facingMode) {
    const session = sessionRef.current + 1; sessionRef.current = session;
    setStatus("requesting"); setError(""); setScanMessage(""); setDetections([]);
    matchesRef.current.clear(); pendingRef.current.clear(); lastOwnerMatchRef.current.clear();
    await useAssetRegistryStore.getState().syncAssets();
    if (!navigator.mediaDevices?.getUserMedia) { setStatus("idle"); setError("Camera access is not supported by this browser. Use Chrome, Edge, or Safari over HTTPS."); return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: selectedFacingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      if (sessionRef.current !== session) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Camera preview is unavailable.");
      video.srcObject = stream;
      await video.play();
      setFrameSize({ width: video.videoWidth || 1280, height: video.videoHeight || 720 });
      setStatus("loading-model");
    } catch (cause) {
      streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
      setStatus("idle"); setError(cameraErrorMessage(cause)); return;
    }

    try {
      const [{ load }, tf] = await Promise.all([import("@tensorflow-models/coco-ssd"), import("@tensorflow/tfjs")]);
      await tf.ready();
      let model = await load({ base: "mobilenet_v2" });
      if (sessionRef.current !== session || !streamRef.current) return;
      setStatus("live");
      const mobileMode = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
      const detectionInterval = mobileMode ? 650 : 220;
      const ownerInterval = mobileMode ? 3000 : 1200;
      const maxDetections = mobileMode ? 3 : MAX_DETECTIONS;
      const inferenceCanvas = document.createElement("canvas");
      let last = 0; let detecting = false; let inferenceFailures = 0; let cpuFallbackAttempted = false;
      const loop = async (time: number) => {
        if (sessionRef.current !== session || !streamRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && time - last > detectionInterval && !detecting) {
          detecting = true;
          try {
            const sourceWidth = video.videoWidth;
            const sourceHeight = video.videoHeight;
            const inferenceWidth = Math.min(sourceWidth, mobileMode ? 480 : 720);
            const inferenceHeight = Math.max(1, Math.round(sourceHeight * inferenceWidth / sourceWidth));
            if (inferenceCanvas.width !== inferenceWidth || inferenceCanvas.height !== inferenceHeight) {
              inferenceCanvas.width = inferenceWidth; inferenceCanvas.height = inferenceHeight;
            }
            inferenceCanvas.getContext("2d", { alpha: false })?.drawImage(video, 0, 0, inferenceWidth, inferenceHeight);
            const scaleX = sourceWidth / inferenceWidth; const scaleY = sourceHeight / inferenceHeight;
            const predictions = await model.detect(inferenceCanvas, 20, 0.3);
            const raw = predictions.map((result) => ({ ...result, bbox: [result.bbox[0] * scaleX, result.bbox[1] * scaleY, result.bbox[2] * scaleX, result.bbox[3] * scaleY] as [number, number, number, number] }));
            inferenceFailures = 0;
            const stable = raw
              .filter((result) => result.score >= minimumDetectionScore(result.class))
              .sort((left, right) => right.score - left.score)
              .slice(0, maxDetections);
            setScanMessage(stable.length ? `${stable.length} prediction${stable.length === 1 ? "" : "s"} received from the camera.` : "AI is scanning frames, but no recognizable COCO object is visible yet.");

            const currentAssets = useAssetRegistryStore.getState().assets;
            const hasRegisteredReferences = currentAssets.some((asset) => asset.embeddings?.length || asset.embedding?.length);
            if (hasRegisteredReferences && time - lastOwnerScanRef.current > ownerInterval) {
              lastOwnerScanRef.current = time;
              for (const result of stable) {
                const bbox = result.bbox as [number, number, number, number];
                const key = detectionKey(result.class, bbox);
                const recentlyMatched = time - (lastOwnerMatchRef.current.get(key) ?? -Infinity) < (mobileMode ? 10000 : 5000);
                if (!pendingRef.current.has(key) && !recentlyMatched) {
                  pendingRef.current.add(key); matchesRef.current.set(key, { similarity: 0, status: "Identifying" });
                  void identifyOwner(video, bbox, result.class, currentAssets).then((match) => { matchesRef.current.set(key, match); lastOwnerMatchRef.current.set(key, performance.now()); }).catch(() => matchesRef.current.set(key, { similarity: 0, status: "Unknown" })).finally(() => pendingRef.current.delete(key));
                }
              }
            }

            setDetections(stable.map((result) => {
              const bbox = result.bbox as [number, number, number, number];
              const key = detectionKey(result.class, bbox);
              return { bbox, class: result.class, score: result.score, key, owner: matchesRef.current.get(key) ?? { similarity: 0, status: "Identifying" } };
            }));
            last = time;
          } catch (cause) {
            inferenceFailures += 1;
            if (inferenceFailures >= 2 && !cpuFallbackAttempted) {
              cpuFallbackAttempted = true; setStatus("loading-model");
              try {
                model.dispose();
                await tf.setBackend("cpu"); await tf.ready();
                model = await load({ base: "lite_mobilenet_v2" });
                inferenceFailures = 0; setError(""); setStatus("live");
              } catch (fallbackCause) {
                setStatus("camera-only");
                setError(`Camera is open, but this device could not start the detection engine${fallbackCause instanceof Error ? `: ${fallbackCause.message}` : "."}`);
              }
            } else if (cpuFallbackAttempted && inferenceFailures >= 2) {
              setStatus("camera-only");
              setError(`Camera is open, but object detection failed on this device${cause instanceof Error ? `: ${cause.message}` : "."}`);
            }
            last = time;
          } finally { detecting = false; }
        }
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    } catch {
      if (sessionRef.current === session && streamRef.current) { setStatus("camera-only"); setError("The webcam is open, but the detection models could not load. Check your connection and retry."); }
    }
  }

  function stop() {
    sessionRef.current += 1; cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle"); setDetections([]); setError("");
    setScanMessage("");
  }

  function switchCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    const wasOpen = status !== "idle";
    stop(); setFacingMode(next);
    if (wasOpen) window.setTimeout(() => void start(next), 0);
  }

  const vw = frameSize.width; const vh = frameSize.height;
  const cameraOpen = ["loading-model", "live", "camera-only"].includes(status);
  const peopleCount = detections.filter((detection) => detection.class === "person").length;
  const objectCount = detections.length - peopleCount;

  return <div className={`${embedded ? "" : "mx-auto max-w-7xl pb-12"} space-y-6`}>
    {!embedded ? <Link to={routes.assetOwnerIdentification}><Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back to module</Button></Link> : null}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="accent">{embedded ? "Object Detection selected" : "Repository model integrated"}</Badge><h1 className={`mt-4 font-semibold text-white ${embedded ? "text-2xl" : "text-4xl"}`}>Live object & person detection</h1><p className="mt-3 text-slate-400">Stable detections and visual owner matching run locally in your browser.</p></div><div className="flex flex-wrap gap-2"><Button className="md:hidden" variant="secondary" onClick={switchCamera}><RefreshCw className="h-4 w-4" />{facingMode === "environment" ? "Use front camera" : "Use rear camera"}</Button>{status === "idle" ? <Button onClick={() => void start()}><Camera className="h-4 w-4" /><span className="md:hidden">Open {facingMode === "user" ? "front" : "rear"} camera</span><span className="hidden md:inline">Open camera</span></Button> : <Button variant="danger" onClick={stop}><StopCircle className="h-4 w-4" />Stop camera</Button>}</div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="overflow-hidden p-0"><div className="relative aspect-video bg-black"><video ref={videoRef} className="h-full w-full object-contain" muted autoPlay playsInline />
        {status === "requesting" ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90"><Loader2 className="h-9 w-9 animate-spin text-cyan-200" /><p className="mt-4 text-sm text-slate-300">Waiting for camera permission...</p></div> : null}
        {status === "loading-model" ? <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-200"><Loader2 className="h-4 w-4 animate-spin text-cyan-200" />Camera open · loading detection and identity models...</div> : null}
        {detections.map((detection) => { const [x, y, w, h] = detection.bbox; const known = detection.owner.status === "Known"; return <div key={detection.key} className={`absolute border-2 ${detection.class === "person" ? "border-violet-300" : "border-cyan-300"}`} style={{ left: `${x / vw * 100}%`, top: `${y / vh * 100}%`, width: `${w / vw * 100}%`, height: `${h / vh * 100}%` }}><span className={`absolute -top-8 left-0 whitespace-nowrap px-2 py-1 font-mono text-xs font-semibold text-slate-950 ${detection.class === "person" ? "bg-violet-300" : "bg-cyan-300"}`}>{detection.class} {Math.round(detection.score * 100)}% · {known ? detection.owner.asset?.ownerName : detection.owner.status}</span></div>; })}
        <div className="absolute left-4 top-4"><Badge variant={status === "live" ? "success" : cameraOpen ? "accent" : "neutral"}>{status === "live" ? "AI live" : cameraOpen ? "Camera live" : status === "requesting" ? "Requesting access" : "Camera offline"}</Badge></div>
      </div></Card>
      <Card><CardContent><div className="flex items-center gap-3"><ScanLine className="h-5 w-5 text-cyan-200" /><h2 className="font-semibold text-white">Current detections</h2></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl border border-violet-300/20 bg-violet-400/10 p-3"><p className="text-2xl font-semibold text-white">{peopleCount}</p><p className="text-xs text-violet-200">People</p></div><div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3"><p className="text-2xl font-semibold text-white">{objectCount}</p><p className="text-xs text-cyan-200">Objects</p></div></div><div className="mt-5 space-y-3">{detections.map((detection) => <div key={`${detection.key}-list`} className="rounded-xl border border-white/10 p-4"><div className="flex items-center justify-between"><p className="flex items-center gap-2 font-medium capitalize text-white">{detection.class === "person" ? <UserRound className="h-4 w-4 text-violet-200" /> : null}{detection.class}</p><Badge variant={detection.owner.status === "Known" ? "success" : detection.owner.status === "Identifying" ? "neutral" : "warning"}>{Math.round(detection.score * 100)}%</Badge></div><p className="mt-2 text-sm text-slate-400">{detection.owner.status === "Known" ? `${detection.owner.asset?.ownerName} · ${detection.owner.asset?.assetId}` : detection.owner.status === "Identifying" ? "Identifying owner..." : "Unregistered / unknown"}</p>{detection.owner.status !== "Identifying" ? <p className="mt-1 text-xs text-slate-500">Visual similarity {Math.round(detection.owner.similarity * 100)}%</p> : null}</div>)}{status === "live" && detections.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">{scanMessage || "Starting the first camera scan..."}</p> : null}{status === "idle" ? <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Open the webcam to begin.</p> : null}</div>{error ? <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}</CardContent></Card>
    </div>
  </div>;
}
