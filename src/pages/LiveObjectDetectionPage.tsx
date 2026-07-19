import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Loader2, ScanLine, StopCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useAssetRegistryStore } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

type CameraStatus = "idle" | "requesting" | "loading-model" | "live" | "camera-only";

function cameraErrorMessage(cause: unknown) {
  if (cause instanceof DOMException) {
    if (cause.name === "NotAllowedError" || cause.name === "SecurityError") {
      return "Camera permission was blocked. Allow camera access for this site in your browser settings, then try again.";
    }
    if (cause.name === "NotFoundError" || cause.name === "OverconstrainedError") {
      return "No available camera was found on this device.";
    }
    if (cause.name === "NotReadableError" || cause.name === "AbortError") {
      return "The camera is being used by another app. Close the other app and try again.";
    }
  }
  return cause instanceof Error ? cause.message : "Unable to open the camera.";
}

export function LiveObjectDetectionPage() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("object-detection"));
  const assets = useAssetRegistryStore((state) => state.assets);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef(0);
  const sessionRef = useRef(0);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => () => {
    sessionRef.current += 1;
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  if (!subscribed) return <Navigate to={routes.assetOwnerIdentification} replace />;

  async function start() {
    const session = sessionRef.current + 1;
    sessionRef.current = session;
    setStatus("requesting");
    setError("");
    setDetections([]);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("idle");
      setError("Camera access is not supported by this browser. Open the site in Chrome, Edge, or Safari over HTTPS.");
      return;
    }

    let stream: MediaStream;
    try {
      // Request permission immediately while this function still has the user's click gesture.
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (sessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Camera preview is unavailable.");
      video.srcObject = stream;
      await video.play();
      setStatus("loading-model");
    } catch (cause) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStatus("idle");
      setError(cameraErrorMessage(cause));
      return;
    }

    try {
      const [{ load }, tf] = await Promise.all([
        import("@tensorflow-models/coco-ssd"),
        import("@tensorflow/tfjs"),
      ]);
      await tf.ready();
      const model = await load({ base: "lite_mobilenet_v2" });
      if (sessionRef.current !== session || !streamRef.current) return;
      setStatus("live");

      let last = 0;
      let detecting = false;
      const loop = async (time: number) => {
        if (sessionRef.current !== session || !streamRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && time - last > 180 && !detecting) {
          detecting = true;
          try {
            const results = await model.detect(video, 12, 0.45);
            setDetections(results.map((result) => ({
              bbox: result.bbox as [number, number, number, number],
              class: result.class,
              score: result.score,
            })));
            last = time;
          } finally {
            detecting = false;
          }
        }
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    } catch {
      if (sessionRef.current === session && streamRef.current) {
        setStatus("camera-only");
        setError("The webcam is open, but the detection model could not load. Check your connection and try again.");
      }
    }
  }

  function stop() {
    sessionRef.current += 1;
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setDetections([]);
    setError("");
  }

  const video = videoRef.current;
  const vw = video?.videoWidth || 1280;
  const vh = video?.videoHeight || 720;
  const cameraOpen = status === "loading-model" || status === "live" || status === "camera-only";
  const statusLabel = status === "live" ? "AI live" : cameraOpen ? "Camera live" : status === "requesting" ? "Requesting access" : "Camera offline";

  return <div className="mx-auto max-w-7xl space-y-6 pb-12">
    <Link to={routes.assetOwnerIdentification}><Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back to module</Button></Link>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><Badge variant="accent">Subscriber workspace</Badge><h1 className="mt-4 text-4xl font-semibold text-white">Live object detection</h1><p className="mt-3 text-slate-400">Camera frames are processed locally in your browser and are not uploaded.</p></div>
      <div className="flex gap-3">{status === "idle" ? <Button onClick={start}><Camera className="h-4 w-4" />Open webcam</Button> : <Button variant="danger" onClick={stop}><StopCircle className="h-4 w-4" />Stop camera</Button>}</div>
    </div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video bg-black">
          <video ref={videoRef} className="h-full w-full object-contain" muted autoPlay playsInline />
          {status === "requesting" ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90"><Loader2 className="h-9 w-9 animate-spin text-cyan-200" /><p className="mt-4 text-sm text-slate-300">Waiting for camera permission...</p></div> : null}
          {status === "loading-model" ? <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-200"><Loader2 className="h-4 w-4 animate-spin text-cyan-200" />Camera open · loading AI detection...</div> : null}
          {detections.map((detection, index) => {
            const [x, y, w, h] = detection.bbox;
            const owner = assets.find((asset) => asset.objectType === detection.class.toLowerCase());
            return <div key={`${detection.class}-${index}`} className="absolute border-2 border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]" style={{ left: `${x / vw * 100}%`, top: `${y / vh * 100}%`, width: `${w / vw * 100}%`, height: `${h / vh * 100}%` }}><span className="absolute -top-8 left-0 whitespace-nowrap bg-cyan-300 px-2 py-1 font-mono text-xs font-semibold text-slate-950">{detection.class} {Math.round(detection.score * 100)}%{owner ? ` · ${owner.ownerName}` : " · Unknown"}</span></div>;
          })}
          <div className="absolute left-4 top-4"><Badge variant={status === "live" ? "success" : cameraOpen ? "accent" : "neutral"}>{statusLabel}</Badge></div>
        </div>
      </Card>
      <Card><CardContent>
        <div className="flex items-center gap-3"><ScanLine className="h-5 w-5 text-cyan-200" /><h2 className="font-semibold text-white">Current detections</h2></div>
        <div className="mt-5 space-y-3">
          {detections.map((detection, index) => { const owner = assets.find((asset) => asset.objectType === detection.class.toLowerCase()); return <div key={`${detection.class}-list-${index}`} className="rounded-xl border border-white/10 p-4"><div className="flex items-center justify-between"><p className="font-medium capitalize text-white">{detection.class}</p><Badge variant={owner ? "success" : "warning"}>{Math.round(detection.score * 100)}%</Badge></div><p className="mt-2 text-sm text-slate-400">{owner ? `${owner.ownerName} · ${owner.assetId}` : "Unregistered asset"}</p></div>; })}
          {status === "live" && detections.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Point the camera at a common object.</p> : null}
          {status === "idle" ? <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Open the webcam to begin.</p> : null}
        </div>
        {error ? <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      </CardContent></Card>
    </div>
  </div>;
}
