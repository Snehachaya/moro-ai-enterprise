import { Radio, Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cameraMetrics } from "@/data/dashboard";
import { DetectionOverlay } from "@/components/dashboard/DetectionOverlay";

export function LiveCameraPanel() {
  return (
    <Card className="overflow-hidden border-cyan-300/20 bg-[#06101f]/90">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accentSoft text-accent">
            <Video className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-white">CAM_04_SOUTH_GATE</h2>
              <Badge variant="danger" className="gap-2">
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                LIVE
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">1920x1080 @ 60FPS</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">AI Surveillance Feed / South Perimeter</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative min-h-[440px] overflow-hidden rounded-xl border border-borderSubtle bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,8,23,0.78)),radial-gradient(circle_at_52%_45%,rgba(6,182,212,0.2),transparent_18rem),radial-gradient(circle_at_72%_64%,rgba(244,63,94,0.16),transparent_12rem)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute bottom-16 left-0 right-0 h-px bg-cyan-300/20" />
          <div className="absolute bottom-16 left-0 h-24 w-full bg-gradient-to-t from-cyan-400/10 to-transparent" />
          <DetectionOverlay />
          <div className="absolute left-4 top-4 rounded-lg border border-cyan-300/20 bg-slate-950/80 px-3 py-2 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">MoroAI Vision Engine</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-3">
            {cameraMetrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-borderSubtle bg-slate-950/78 px-4 py-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{metric.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
