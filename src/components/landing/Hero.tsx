import { ArrowRight, Camera, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

const featurePills = ["24/7 AI vigilance", "Threat recognition", "Instant alerts"];
const feedCells = [
  { label: "NORTH GATE", box: "left-[42%] top-[24%] h-24 w-16", glow: "left-[28%] top-[42%]" },
  { label: "SOUTH ROAD", box: "left-[56%] top-[28%] h-20 w-14", glow: "left-[52%] top-[50%]" },
  { label: "EAST ENTRY", box: "left-[62%] top-[22%] h-16 w-20", glow: "left-[68%] top-[46%]" },
  { label: "LOADING BAY", box: "left-[20%] top-[36%] h-24 w-14", glow: "left-[62%] top-[50%]" },
  { label: "CITY PERIMETER", box: "left-[50%] top-[35%] h-20 w-24", glow: "left-[50%] top-[52%]" },
  { label: "WEST LANE", box: "left-[52%] top-[28%] h-20 w-14", glow: "left-[34%] top-[48%]" },
  { label: "ALLEY 02", box: "left-[46%] top-[32%] h-16 w-12", glow: "left-[70%] top-[52%]" },
  { label: "WAREHOUSE", box: "left-[58%] top-[30%] h-20 w-12", glow: "left-[46%] top-[48%]" },
  { label: "PARKING", box: "left-[74%] top-[32%] h-16 w-16", glow: "left-[34%] top-[54%]" },
];

const telemetryRows = [
  { label: "ai.spatial_grid", width: "w-[58%]" },
  { label: "tracking_stream", width: "w-[67%]" },
  { label: "edge_sync", width: "w-[76%]" },
  { label: "video_integrity", width: "w-[85%]" },
];

export function Hero() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section id="home" className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(6,182,212,0.18),transparent_30rem),radial-gradient(circle_at_86%_16%,rgba(99,102,241,0.16),transparent_28rem)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <Badge variant="accent" className="gap-2">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Advanced Security Ecosystem
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Future of Intelligent Surveillance and Safety
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Empowering enterprise-grade security with five core detection modules. Real-time vision intelligence for
            safer sites, faster response, and stronger operational control.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                {pill}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={isAuthenticated ? routes.marketplace : routes.register}>
              <Button size="lg" className="w-full sm:w-auto">
                {isAuthenticated ? "Explore Modules" : "Request System Demo"}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="relative"
        >
          <div className="absolute -left-8 top-12 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <Card className="relative overflow-hidden border-cyan-300/25 bg-[#031318]/95 p-3 shadow-[0_0_60px_rgba(6,182,212,0.18)]">
            <div className="mb-3 flex items-center justify-between border-b border-cyan-300/20 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">AI Camera Preview</p>
                  <p className="text-xs text-slate-500">Scanning_Module_01</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Live
              </span>
            </div>

            <div className="relative min-h-[430px] overflow-hidden rounded-xl border border-cyan-300/25 bg-[#02070b]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px bg-cyan-300/20">
                <div className="relative col-span-1 row-span-1 overflow-hidden bg-[#041217] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">Enterprise status</p>
                  <div className="mt-4 h-14 rounded-sm bg-cyan-300/30" />
                  <div className="mt-5 space-y-2">
                    {telemetryRows.map((row, index) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-cyan-100/50">
                          <span>{row.label}</span>
                          <span>{84 + index * 3}%</span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-cyan-950">
                          <div className={`h-full rounded-full bg-cyan-300 ${row.width}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {feedCells.map((feed, index) => (
                  <div
                    key={feed.label}
                    className={[
                      "relative overflow-hidden bg-[#061016]",
                      index === 1 ? "col-span-2 row-span-1" : "",
                      index === 4 ? "col-span-2 row-span-1" : "",
                    ].join(" ")}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,182,212,0.12),rgba(2,8,23,0.18)),radial-gradient(circle_at_50%_52%,rgba(248,113,113,0.32),transparent_4.2rem),radial-gradient(circle_at_70%_20%,rgba(125,211,252,0.2),transparent_5rem)]" />
                    <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(12deg,transparent_42%,rgba(148,163,184,0.13)_43%,transparent_45%),linear-gradient(168deg,transparent_42%,rgba(148,163,184,0.12)_43%,transparent_45%)]" />
                    <div className="absolute inset-x-0 top-[18%] flex justify-between px-4">
                      {Array.from({ length: 7 }).map((_, buildingIndex) => (
                        <span
                          key={buildingIndex}
                          className="h-28 w-[9%] rounded-t-sm bg-slate-950/45 shadow-[inset_0_0_18px_rgba(6,182,212,0.08)]"
                        />
                      ))}
                    </div>
                    <span className={`absolute ${feed.glow} h-6 w-6 rounded-full bg-rose-400/55 blur-md`} />
                    <span className={`absolute ${feed.box} rounded-sm border-2 border-emerald-400/90 shadow-[0_0_18px_rgba(52,211,153,0.45)]`} />
                    <span className="absolute left-2 top-2 text-[9px] font-medium uppercase tracking-[0.18em] text-cyan-100/60">
                      {feed.label}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[8px] uppercase tracking-wider text-cyan-100/35">
                      <span>cam_{String(index + 1).padStart(2, "0")}</span>
                      <span>tracking</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-0 top-[47%] z-10 flex justify-center">
                <div className="border border-cyan-300/70 bg-[#031318]/92 px-5 py-3 shadow-[0_0_28px_rgba(6,182,212,0.22)] backdrop-blur">
                  <p className="font-mono text-base uppercase tracking-[0.28em] text-cyan-100 sm:text-xl">Person: Known_ID_402</p>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 grid w-44 gap-1 text-[9px] uppercase tracking-[0.16em] text-cyan-100/45">
                {["vector lock", "edge feed stable", "subject confidence 98.4"].map((item) => (
                  <span key={item} className="rounded-sm bg-slate-950/45 px-2 py-1">
                    {item}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-3 right-3 rounded-sm border border-rose-400/45 bg-rose-500/10 px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-200">Threat: knife detected</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
