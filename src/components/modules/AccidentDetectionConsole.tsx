import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Camera, FileVideo, Loader2, RefreshCw, ShieldCheck, StopCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useSubscriptionStore } from "@/store/subscriptionStore";

type DetectionModel = Awaited<ReturnType<typeof import("@tensorflow-models/coco-ssd")["load"]>>;
type AnalysisStatus = "idle" | "requesting" | "loading" | "live" | "error";
type Vehicle = { bbox: [number, number, number, number]; class: string; score: number };
type Incident = { id: string; time: string; risk: number; source: "camera" | "video" };
type SceneModel = {
  input: { features: number };
  normalization: { mean: number[]; scale: number[] };
  classifier: { hiddenSize: number; weights1: number[]; bias1: number[]; weights2: number[]; bias2: number; threshold: number };
};

const VEHICLES = new Set(["car", "truck", "bus", "motorcycle", "bicycle"]);
let modelPromise: Promise<DetectionModel> | null = null;
let sceneModelPromise: Promise<SceneModel> | null = null;

async function loadAccidentModel() {
  if (!modelPromise) {
    modelPromise = Promise.all([import("@tensorflow-models/coco-ssd"), import("@tensorflow/tfjs")]).then(async ([coco, tf]) => {
      await tf.ready();
      return coco.load({ base: "lite_mobilenet_v2" });
    });
  }
  return modelPromise;
}

async function loadSceneModel() {
  if (!sceneModelPromise) sceneModelPromise = fetch(`${import.meta.env.BASE_URL}models/accident-model.json`).then((response) => {
    if (!response.ok) throw new Error("The trained accident model could not be downloaded.");
    return response.json() as Promise<SceneModel>;
  });
  return sceneModelPromise;
}

function classifyScene(source: HTMLCanvasElement, model: SceneModel, canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return 0;
  context.drawImage(source, 0, 0, 16, 16);
  const pixels = context.getImageData(0, 0, 16, 16).data;
  const rgb: number[] = []; const gray = new Float32Array(256); const histograms = Array.from({ length: 3 }, () => new Float32Array(8));
  for (let pixel = 0, offset = 0; pixel < 256; pixel += 1, offset += 4) {
    const red = pixels[offset] / 255; const green = pixels[offset + 1] / 255; const blue = pixels[offset + 2] / 255;
    rgb.push(red, green, blue); gray[pixel] = red * 0.299 + green * 0.587 + blue * 0.114;
    histograms[0][Math.min(7, Math.floor(red * 8))] += 1 / 256;
    histograms[1][Math.min(7, Math.floor(green * 8))] += 1 / 256;
    histograms[2][Math.min(7, Math.floor(blue * 8))] += 1 / 256;
  }
  const gradients: number[] = [];
  for (let y = 0; y < 16; y += 1) for (let x = 0; x < 16; x += 1) {
    const gx = x > 0 && x < 15 ? (gray[y * 16 + x + 1] - gray[y * 16 + x - 1]) * 0.5 : 0;
    const gy = y > 0 && y < 15 ? (gray[(y + 1) * 16 + x] - gray[(y - 1) * 16 + x]) * 0.5 : 0;
    gradients.push(Math.hypot(gx, gy));
  }
  const raw = [...rgb, ...gradients, ...histograms.flatMap((histogram) => Array.from(histogram))];
  const normalized = raw.map((value, index) => (value - model.normalization.mean[index]) / model.normalization.scale[index]);
  const hidden = new Float32Array(model.classifier.hiddenSize);
  for (let output = 0; output < hidden.length; output += 1) {
    let value = model.classifier.bias1[output];
    for (let input = 0; input < normalized.length; input += 1) value += normalized[input] * model.classifier.weights1[input * hidden.length + output];
    hidden[output] = Math.max(0, value);
  }
  let logit = model.classifier.bias2;
  for (let index = 0; index < hidden.length; index += 1) logit += hidden[index] * model.classifier.weights2[index];
  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, logit))));
}

function boxesAreClose(left: Vehicle, right: Vehicle) {
  const [lx, ly, lw, lh] = left.bbox; const [rx, ry, rw, rh] = right.bbox;
  const overlapX = Math.max(0, Math.min(lx + lw, rx + rw) - Math.max(lx, rx));
  const overlapY = Math.max(0, Math.min(ly + lh, ry + rh) - Math.max(ly, ry));
  if (overlapX * overlapY > 0) return true;
  const distance = Math.hypot(lx + lw / 2 - (rx + rw / 2), ly + lh / 2 - (ry + rh / 2));
  return distance < Math.max(lw, rw) * 0.95;
}

function cameraMessage(cause: unknown) {
  if (cause instanceof DOMException && cause.name === "NotAllowedError") return "Camera permission was blocked. Allow camera access and try again.";
  return cause instanceof Error ? cause.message : "Unable to start accident detection.";
}

export function AccidentDetectionConsole() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("accident-detection"));
  const addModule = useSubscriptionStore((state) => state.addModule);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef(0);
  const sessionRef = useRef(0);
  const objectUrlRef = useRef("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [motionScore, setMotionScore] = useState(0);
  const [modelScore, setModelScore] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [alertActive, setAlertActive] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [source, setSource] = useState<"camera" | "video">("camera");

  useEffect(() => () => {
    sessionRef.current += 1; cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  function stop() {
    sessionRef.current += 1; cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null;
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.srcObject = null; videoRef.current.removeAttribute("src"); }
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = ""; }
    setStatus("idle"); setVehicles([]); setMotionScore(0); setModelScore(0); setRiskScore(0); setAlertActive(false); setError("");
  }

  async function analyze(activeSource: "camera" | "video") {
    const session = sessionRef.current + 1; sessionRef.current = session;
    setStatus("loading"); setError(""); setVehicles([]); setAlertActive(false);
    try {
      const video = videoRef.current;
      if (!video) throw new Error("Video preview is unavailable.");
      video.pause();
      const [model, sceneModel] = await Promise.all([loadAccidentModel(), loadSceneModel()]);
      if (sessionRef.current !== session) return;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve, reject) => {
          const ready = () => { cleanup(); resolve(); };
          const failed = () => { cleanup(); reject(new Error("The selected video could not be prepared for analysis.")); };
          const cleanup = () => { video.removeEventListener("loadedmetadata", ready); video.removeEventListener("error", failed); };
          video.addEventListener("loadedmetadata", ready, { once: true });
          video.addEventListener("error", failed, { once: true });
        });
      }
      if (sessionRef.current !== session) return;
      if (activeSource === "video") video.currentTime = 0;
      await video.play();
      setStatus("live");
      const analysisCanvas = document.createElement("canvas"); analysisCanvas.width = 320; analysisCanvas.height = 180;
      const classifierCanvas = document.createElement("canvas"); classifierCanvas.width = 16; classifierCanvas.height = 16;
      const context = analysisCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Frame analysis is unavailable in this browser.");
      let previousGray: Uint8Array | null = null; let previousArea = 0; let lastScan = 0; let riskFrames = 0; let lastAlert = 0;
      const history: number[] = [];
      const loop = async (time: number) => {
        if (sessionRef.current !== session) return;
        const video = videoRef.current;
        if (video && !video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && time - lastScan > 550) {
          try {
            context.drawImage(video, 0, 0, 320, 180);
            const pixels = context.getImageData(0, 0, 320, 180).data;
            const gray = new Uint8Array(320 * 180); let difference = 0;
            for (let index = 0, pixel = 0; index < pixels.length; index += 4, pixel += 1) {
              gray[pixel] = (pixels[index] * 77 + pixels[index + 1] * 150 + pixels[index + 2] * 29) >> 8;
              if (previousGray) difference += Math.abs(gray[pixel] - previousGray[pixel]);
            }
            const motion = previousGray ? difference / gray.length : 0; previousGray = gray;
            const predictions = await model.detect(analysisCanvas, 12, 0.18);
            const accidentProbability = classifyScene(analysisCanvas, sceneModel, classifierCanvas);
            const currentVehicles = predictions.filter((item) => VEHICLES.has(item.class)).map((item) => ({ bbox: item.bbox as [number, number, number, number], class: item.class, score: item.score }));
            const totalArea = currentVehicles.reduce((sum, item) => sum + item.bbox[2] * item.bbox[3], 0);
            const areaShift = previousArea ? Math.abs(totalArea - previousArea) / Math.max(previousArea, 1) : 0; previousArea = totalArea;
            const baseline = history.length ? history.reduce((sum, value) => sum + value, 0) / history.length : motion;
            history.push(motion); if (history.length > 30) history.shift();
            const closePair = currentVehicles.some((item, index) => currentVehicles.slice(index + 1).some((other) => boxesAreClose(item, other)));
            const motionSpike = history.length > 8 && motion > Math.max(10, baseline * 1.8);
            const heuristicRisk = Math.min(100, Math.round((closePair ? 42 : 0) + Math.min(35, motion * 1.4) + Math.min(23, areaShift * 30)));
            const currentRisk = Math.max(heuristicRisk, Math.round(accidentProbability * 100));
            const possibleImpact = closePair && motionSpike && (areaShift > 0.08 || motion > 20);
            const learnedPositive = accidentProbability >= sceneModel.classifier.threshold;
            const confirmedSignal = (learnedPositive && possibleImpact) || accidentProbability >= 0.72;
            riskFrames = confirmedSignal ? riskFrames + 1 : Math.max(0, riskFrames - 1);
            if (riskFrames >= (possibleImpact ? 2 : 5) && time - lastAlert > 30000) {
              lastAlert = time; riskFrames = 0; setAlertActive(true);
              const incident = { id: crypto.randomUUID(), time: new Date().toLocaleTimeString(), risk: currentRisk, source: activeSource } as Incident;
              setIncidents((current) => [incident, ...current].slice(0, 5));
              window.setTimeout(() => setAlertActive(false), 8000);
              if ("speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance("Possible accident detected. Please review the camera immediately."));
            }
            setVehicles(currentVehicles); setMotionScore(Math.round(motion)); setModelScore(Math.round(accidentProbability * 100)); setRiskScore(currentRisk); lastScan = time;
          } catch (cause) {
            setError(cameraMessage(cause)); setStatus("error"); lastScan = time;
          }
        }
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    } catch (cause) { setStatus("error"); setError(cameraMessage(cause)); }
  }

  async function startCamera(selected = facingMode) {
    stop(); setSource("camera"); setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: selected }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = stream; const video = videoRef.current; if (!video) throw new Error("Camera preview is unavailable.");
      video.srcObject = stream; await analyze("camera");
    } catch (cause) { setStatus("error"); setError(cameraMessage(cause)); }
  }

  async function openVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    stop(); setSource("video"); objectUrlRef.current = URL.createObjectURL(file);
    const video = videoRef.current; if (!video) return;
    video.src = objectUrlRef.current; video.loop = true; video.load(); await analyze("video");
  }

  function switchCamera() {
    const next = facingMode === "environment" ? "user" : "environment"; setFacingMode(next);
    if (status !== "idle") void startCamera(next);
  }

  if (!subscribed) return <section className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-emerald-200" /><Badge variant="success" className="mt-5">Accident Detection add-on</Badge><h2 className="mt-4 text-3xl font-semibold text-white">Live accident detection</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">Start the 30-day trial to analyze a webcam or uploaded traffic video directly in your browser. No payment details are required.</p><Link to={routes.subscription}><Button className="mt-6" onClick={() => addModule("accident-detection")}>Start subscription</Button></Link></section>;

  const width = 320; const height = 180;
  return <section className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant={alertActive ? "warning" : "success"}>{alertActive ? "Possible accident" : "Monitoring ready"}</Badge><h2 className="mt-4 text-3xl font-semibold text-white">Browser accident detection</h2><p className="mt-2 text-sm text-slate-400">Adapted from the supplied vehicle, motion, proximity, and impact-detection pipeline.</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={switchCamera}><RefreshCw className="h-4 w-4" />{facingMode === "environment" ? "Use front camera" : "Use rear camera"}</Button><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10"><FileVideo className="h-4 w-4" />Analyze video<input className="sr-only" type="file" accept="video/*" onChange={(event) => void openVideo(event)} /></label>{status === "idle" || status === "error" ? <Button onClick={() => void startCamera()}><Camera className="h-4 w-4" />Open camera</Button> : <Button variant="danger" onClick={stop}><StopCircle className="h-4 w-4" />Stop</Button>}</div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"><Card className="overflow-hidden p-0"><div className={`relative aspect-video bg-black ${alertActive ? "ring-4 ring-rose-500/80" : ""}`}><video ref={videoRef} muted playsInline className="h-full w-full object-contain" />{vehicles.map((vehicle, index) => { const [x,y,w,h]=vehicle.bbox; return <div key={`${vehicle.class}-${index}`} className="absolute border-2 border-emerald-300" style={{left:`${x/width*100}%`,top:`${y/height*100}%`,width:`${w/width*100}%`,height:`${h/height*100}%`}}><span className="absolute -top-7 left-0 bg-emerald-300 px-2 py-1 font-mono text-xs font-bold text-slate-950">{vehicle.class} {Math.round(vehicle.score*100)}%</span></div>; })}{alertActive ? <div className="absolute inset-0 flex items-center justify-center bg-rose-950/35"><div className="rounded-xl border border-rose-300 bg-rose-600/90 px-6 py-4 text-center shadow-2xl"><AlertTriangle className="mx-auto h-8 w-8" /><p className="mt-2 font-bold uppercase tracking-wider">Possible accident detected</p></div></div> : null}{["requesting","loading"].includes(status) ? <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85"><Loader2 className="h-8 w-8 animate-spin text-emerald-200" /><p className="ml-3 text-sm text-slate-200">{status === "requesting" ? "Waiting for camera permission..." : "Preparing both detection models · video paused..."}</p></div> : null}</div></Card>
      <Card><CardContent><h3 className="font-semibold text-white">Live risk analysis</h3><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/5 p-3 text-center"><p className="text-2xl font-semibold text-white">{vehicles.length}</p><p className="text-[10px] uppercase text-slate-500">Vehicles</p></div><div className="rounded-xl bg-white/5 p-3 text-center"><p className="text-2xl font-semibold text-white">{motionScore}</p><p className="text-[10px] uppercase text-slate-500">Motion</p></div><div className="rounded-xl bg-cyan-400/10 p-3 text-center"><p className="text-2xl font-semibold text-white">{modelScore}%</p><p className="text-[10px] uppercase text-slate-500">Trained model</p></div><div className={`rounded-xl p-3 text-center ${riskScore > 70 ? "bg-rose-400/15" : "bg-emerald-400/10"}`}><p className="text-2xl font-semibold text-white">{riskScore}%</p><p className="text-[10px] uppercase text-slate-500">Combined risk</p></div></div><p className="mt-4 text-xs leading-5 text-slate-500">Source: {source}. The trained accident classifier is the primary signal; motion, vehicle proximity, and consecutive-frame confirmation reduce false alarms.</p>{error ? <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}<h3 className="mt-6 font-semibold text-white">Recent incidents</h3><div className="mt-3 space-y-2">{incidents.map((incident) => <div key={incident.id} className="flex items-center justify-between rounded-lg border border-rose-300/15 bg-rose-400/5 p-3 text-sm"><span className="text-slate-300">{incident.time} · {incident.source}</span><Badge variant="warning">{incident.risk}%</Badge></div>)}{incidents.length === 0 ? <p className="rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">No accident events in this session.</p> : null}</div></CardContent></Card></div>
  </section>;
}
