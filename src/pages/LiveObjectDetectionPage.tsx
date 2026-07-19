import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Loader2, ScanLine, StopCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useAssetRegistryStore } from "@/store/assetRegistryStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface Detection { bbox: [number, number, number, number]; class: string; score: number; }

export function LiveObjectDetectionPage() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("object-detection"));
  const assets = useAssetRegistryStore((state) => state.assets);
  const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream|null>(null); const frameRef = useRef<number>(0);
  const [status,setStatus]=useState<"idle"|"loading"|"live">("idle"); const [detections,setDetections]=useState<Detection[]>([]); const [error,setError]=useState("");
  useEffect(()=>()=>{ cancelAnimationFrame(frameRef.current); streamRef.current?.getTracks().forEach((track)=>track.stop()); },[]);
  if (!subscribed) return <Navigate to={routes.assetOwnerIdentification} replace />;

  async function start() {
    try { setStatus("loading"); setError(""); const [{load},tf]=await Promise.all([import("@tensorflow-models/coco-ssd"),import("@tensorflow/tfjs")]); await tf.ready(); const model=await load({base:"lite_mobilenet_v2"}); const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:false}); streamRef.current=stream; const video=videoRef.current!; video.srcObject=stream; await video.play(); setStatus("live"); let last=0; const loop=async(time:number)=>{ if(time-last>180){ const results=await model.detect(video,12,0.45); setDetections(results.map((result)=>({bbox:result.bbox as [number,number,number,number],class:result.class,score:result.score}))); last=time; } frameRef.current=requestAnimationFrame(loop); }; frameRef.current=requestAnimationFrame(loop);
    } catch (cause) { setStatus("idle"); setError(cause instanceof Error ? cause.message : "Unable to start camera detection."); }
  }
  function stop(){ cancelAnimationFrame(frameRef.current); streamRef.current?.getTracks().forEach((track)=>track.stop()); streamRef.current=null; setStatus("idle"); setDetections([]); }
  const video=videoRef.current; const vw=video?.videoWidth||1280; const vh=video?.videoHeight||720;
  return <div className="mx-auto max-w-7xl space-y-6 pb-12"><Link to={routes.assetOwnerIdentification}><Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back to module</Button></Link><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="accent">Subscriber workspace</Badge><h1 className="mt-4 text-4xl font-semibold text-white">Live object detection</h1><p className="mt-3 text-slate-400">Camera frames are processed locally in your browser and are not uploaded.</p></div><div className="flex gap-3">{status==="idle"?<Button onClick={start}><Camera className="h-4 w-4" />Open webcam</Button>:<Button variant="danger" onClick={stop}><StopCircle className="h-4 w-4" />Stop camera</Button>}</div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><Card className="overflow-hidden p-0"><div className="relative aspect-video bg-black"><video ref={videoRef} className="h-full w-full object-contain" muted playsInline />{status==="loading"?<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90"><Loader2 className="h-9 w-9 animate-spin text-cyan-200" /><p className="mt-4 text-sm text-slate-300">Loading detection model…</p></div>:null}{detections.map((detection,index)=>{ const [x,y,w,h]=detection.bbox; const owner=assets.find((asset)=>asset.objectType===detection.class.toLowerCase()); return <div key={`${detection.class}-${index}`} className="absolute border-2 border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]" style={{left:`${x/vw*100}%`,top:`${y/vh*100}%`,width:`${w/vw*100}%`,height:`${h/vh*100}%`}}><span className="absolute -top-8 left-0 whitespace-nowrap bg-cyan-300 px-2 py-1 font-mono text-xs font-semibold text-slate-950">{detection.class} {Math.round(detection.score*100)}%{owner?` · ${owner.ownerName}`:" · Unknown"}</span></div>;})}<div className="absolute left-4 top-4"><Badge variant={status==="live"?"success":"neutral"}>{status==="live"?"AI live":"Camera offline"}</Badge></div></div></Card>
      <Card><CardContent><div className="flex items-center gap-3"><ScanLine className="h-5 w-5 text-cyan-200" /><h2 className="font-semibold text-white">Current detections</h2></div><div className="mt-5 space-y-3">{detections.map((detection,index)=>{const owner=assets.find((asset)=>asset.objectType===detection.class.toLowerCase());return <div key={`${detection.class}-list-${index}`} className="rounded-xl border border-white/10 p-4"><div className="flex items-center justify-between"><p className="font-medium capitalize text-white">{detection.class}</p><Badge variant={owner?"success":"warning"}>{Math.round(detection.score*100)}%</Badge></div><p className="mt-2 text-sm text-slate-400">{owner?`${owner.ownerName} · ${owner.assetId}`:"Unregistered asset"}</p></div>})}{status==="live"&&detections.length===0?<p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Point the camera at a common object.</p>:null}{status==="idle"?<p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Open the webcam to begin.</p>:null}</div>{error?<p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>:null}</CardContent></Card></div>
  </div>;
}
