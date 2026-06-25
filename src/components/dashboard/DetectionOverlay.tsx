import { cameraDetections } from "@/data/dashboard";
import { cn } from "@/utils/cn";

export function DetectionOverlay() {
  return (
    <>
      {cameraDetections.map((detection) => (
        <div
          key={detection.id}
          className={cn("absolute rounded border-2 shadow-[0_0_24px_rgba(6,182,212,0.18)]", detection.className)}
        >
          <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-slate-950/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
            {detection.label}
            {detection.confidence ? ` ${detection.confidence}` : ""}
          </span>
        </div>
      ))}
    </>
  );
}
