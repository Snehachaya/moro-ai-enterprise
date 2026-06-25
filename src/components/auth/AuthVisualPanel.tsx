import { AlertTriangle, Flame, Menu, Radar, ShieldCheck, Siren, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";
import { Badge } from "@/components/ui/Badge";

const featurePills = ["Human detection", "Threat recognition", "Edge privacy", "Live alerts"];
const alertBadges = [
  { label: "Fire Detected", icon: Flame },
  { label: "Weapon Found", icon: Siren },
  { label: "Accident Alert", icon: AlertTriangle },
];

const cameraTiles = [
  { label: "Unknown EPI_MK102", size: "col-span-2 row-span-2", box: "left-[34%] top-[23%] h-24 w-20" },
  { label: "Admin verified", size: "col-span-1 row-span-1", box: "left-[43%] top-[16%] h-14 w-12" },
  { label: "Vehicle lane", size: "col-span-1 row-span-1", box: "left-[48%] top-[42%] h-10 w-16" },
  { label: "Asset zone", size: "col-span-1 row-span-1", box: "left-[36%] top-[40%] h-10 w-12" },
  { label: "Perimeter", size: "col-span-1 row-span-1", box: "left-[60%] top-[32%] h-12 w-10" },
  { label: "Package", size: "col-span-1 row-span-1", box: "left-[32%] top-[52%] h-9 w-14" },
];

const systemRows = ["camera mesh", "identity graph", "risk routing", "edge sync"];

export function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden border-r border-borderSubtle bg-surface/40 p-8 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(6,182,212,0.16),transparent_24rem),radial-gradient(circle_at_88%_74%,rgba(99,102,241,0.12),transparent_28rem)]" />
      <div className="relative z-10">
        <AppLogo linked />
        <Badge variant="accent" className="mt-10 gap-2">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Secure access portal
        </Badge>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-white">
          Enterprise AI surveillance starts with trusted identity.
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-slate-400">
          Manage detection modules, sites, users, evidence, and billing from a protected command experience.
        </p>
        <div className="mt-7 flex max-w-lg flex-wrap gap-3">
          {featurePills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-borderSubtle bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#06101f]/88 shadow-[0_30px_90px_rgba(6,182,212,0.18)] backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(6,182,212,0.28),transparent_13rem),radial-gradient(circle_at_92%_7%,rgba(168,85,247,0.18),transparent_13rem),linear-gradient(135deg,rgba(15,23,42,0.45),rgba(2,8,23,0.92))]" />
        <div className="relative min-h-[360px] p-5">
          <div className="rounded-xl border border-cyan-300/20 bg-[#071626]/82 shadow-[inset_0_0_40px_rgba(6,182,212,0.09)]">
            <div className="flex items-center justify-between border-b border-cyan-300/15 px-4 py-2">
              <Menu className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
                AI Sentinel - Global Security Operations
              </p>
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]" />
            </div>

            <div className="grid gap-3 p-4 lg:grid-cols-[1fr_190px]">
              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  {alertBadges.map((alert) => {
                    const Icon = alert.icon;

                    return (
                      <div
                        key={alert.label}
                        className="flex items-center gap-2 rounded-md border border-rose-400/35 bg-rose-500/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-100"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {alert.label}
                      </div>
                    );
                  })}
                </div>

                <div className="grid h-48 grid-cols-4 grid-rows-3 gap-2">
                  {cameraTiles.map((tile, index) => (
                    <div
                      key={tile.label}
                      className={`relative overflow-hidden rounded-md border border-cyan-300/15 bg-[#06101a] ${tile.size}`}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),transparent_46%),radial-gradient(circle_at_47%_38%,rgba(125,211,252,0.24),transparent_4rem),radial-gradient(circle_at_70%_68%,rgba(248,113,113,0.2),transparent_4rem)]" />
                      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(14deg,transparent_42%,rgba(148,163,184,0.12)_43%,transparent_45%),linear-gradient(166deg,transparent_42%,rgba(148,163,184,0.1)_43%,transparent_45%)]" />
                      <span className={`absolute ${tile.box} rounded-sm border-2 border-cyan-200/75 shadow-glow`} />
                      {index === 0 ? (
                        <div className="absolute bottom-3 left-3 rounded border border-cyan-300/30 bg-slate-950/80 px-2 py-1">
                          <div className="flex items-center gap-2">
                            <UserRoundSearch className="h-3 w-3 text-cyan-200" aria-hidden="true" />
                            <span className="text-[9px] uppercase tracking-[0.18em] text-cyan-100">{tile.label}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="absolute bottom-2 left-2 text-[8px] uppercase tracking-[0.15em] text-cyan-100/55">
                          {tile.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {systemRows.map((row) => (
                    <div key={row} className="rounded-md border border-cyan-300/10 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-cyan-100/45">
                        <span>{row}</span>
                        <span>online</span>
                      </div>
                      <div className="mt-3 flex items-end gap-1">
                        {["h-5", "h-8", "h-4", "h-10", "h-7", "h-9"].map((height, index) => (
                          <span key={`${row}-${index}`} className={`w-full rounded-sm bg-cyan-300/25 ${height}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-cyan-300/15 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/55">Scanning</p>
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-glow" />
                </div>
                <div className="relative mx-auto mt-5 aspect-square max-w-[170px] rounded-full border border-cyan-300/35">
                  <div className="absolute inset-4 rounded-full border border-cyan-300/25" />
                  <div className="absolute inset-9 rounded-full border border-cyan-300/20" />
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-300/20" />
                  <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-300/20" />
                  <div className="absolute left-1/2 top-1/2 h-[48%] w-1 origin-top -translate-x-1/2 rounded-full bg-cyan-300/70 shadow-glow" />
                  <span className="absolute left-[32%] top-[28%] h-2 w-2 rounded-full bg-cyan-200 shadow-glow" />
                  <span className="absolute right-[24%] top-[48%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]" />
                  <Radar className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-cyan-100" aria-hidden="true" />
                </div>
                <div className="mt-5 space-y-2">
                  {["site perimeter", "identity match", "alert route"].map((item) => (
                    <div key={item} className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-cyan-100/45">
                      <span>{item}</span>
                      <span className="text-cyan-100/75">ready</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-glow" />
            <span className="font-mono text-base uppercase tracking-[0.28em] text-cyan-100">System Active</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
