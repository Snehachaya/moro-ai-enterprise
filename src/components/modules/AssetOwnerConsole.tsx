import { AlertTriangle, Camera, CheckCircle2, CreditCard, Database, Fingerprint, ScanLine, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const registry = [
  { asset: "Dell Latitude 7440", id: "LAP-2048", owner: "Mahesh R.", department: "Engineering", images: 14, status: "Verified" },
  { asset: "iPhone 15 Pro", id: "MOB-1182", owner: "Sneha C.", department: "Operations", images: 12, status: "Verified" },
  { asset: "Logitech MX Keys", id: "KEY-7310", owner: "Priya N.", department: "Design", images: 10, status: "Verified" },
];

const events = [
  { time: "10:42:18", object: "Laptop", owner: "Mahesh R.", similarity: "96%", camera: "Lobby CAM-02", known: true },
  { time: "10:39:04", object: "Cell phone", owner: "Sneha C.", similarity: "91%", camera: "Floor 3 CAM-07", known: true },
  { time: "10:34:51", object: "Keyboard", owner: "Unknown", similarity: "48%", camera: "Studio CAM-04", known: false },
];

export function AssetOwnerConsole() {
  const subscribed = useSubscriptionStore((state) => state.subscribedIds.includes("asset-owner-identification"));
  const subscribe = useSubscriptionStore((state) => state.subscribe);

  if (!subscribed) {
    return <section className="rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/10 to-slate-950 p-8 text-center"><CreditCard className="mx-auto h-9 w-9 text-cyan-200" /><Badge variant="accent" className="mt-5">Subscription required</Badge><h2 className="mt-4 text-3xl font-semibold text-white">Activate the owner-identification workspace</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">Subscribe while logged in to unlock browser webcam detection, device-local asset registration, and owner-aware detection overlays.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button size="lg" onClick={()=>subscribe("asset-owner-identification")}>Subscribe for ₹449/month</Button><Link to={routes.marketplace}><Button variant="secondary" size="lg">View marketplace</Button></Link></div></section>;
  }

  return (
    <section className="space-y-6" aria-labelledby="owner-console-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="accent" className="gap-2"><Fingerprint className="h-3.5 w-3.5" /> Owner intelligence</Badge>
          <h2 id="owner-console-title" className="mt-4 text-3xl font-semibold tracking-tight text-white">Asset identity command center</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Live view of registry coverage, owner matches, and assets that need enrollment.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to={routes.liveObjectDetection}><Button><Camera className="h-4 w-4" />Open live detection</Button></Link><Link to={routes.assetRegistration}><Button variant="secondary"><Database className="h-4 w-4" />Register asset</Button></Link></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Registered assets", value: "128", note: "+12 this month", icon: Database },
          { label: "Owner match rate", value: "96.4%", note: "Across 8 cameras", icon: UserCheck },
          { label: "Embeddings", value: "1,482", note: "11.6 per asset", icon: Fingerprint },
          { label: "Needs review", value: "7", note: "3 high priority", icon: AlertTriangle },
        ].map(({ label, value, note, icon: Icon }) => (
          <Card key={label}><CardContent><Icon className="h-5 w-5 text-cyan-200" /><p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold text-white">{value}</p><p className="mt-2 text-xs text-slate-400">{note}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><Camera className="h-5 w-5 text-cyan-200" /><div><p className="font-semibold text-white">Live owner identification</p><p className="text-xs text-slate-500">Lobby CAM-02 · 24 FPS</p></div></div><Badge variant="success">Live</Badge></div>
          <div className="relative min-h-[360px] overflow-hidden bg-[#050a10]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute inset-x-[15%] bottom-[18%] top-[18%] rounded-xl border border-white/10 bg-gradient-to-b from-slate-700/35 to-slate-950/70" />
            <div className="absolute left-[27%] top-[31%] h-[38%] w-[39%] border-2 border-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.28)]"><span className="absolute -top-9 left-0 bg-cyan-300 px-3 py-2 font-mono text-xs font-semibold text-slate-950">LAPTOP · 98%</span></div>
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-cyan-300/20 bg-slate-950/90 p-4 backdrop-blur"><div className="grid gap-3 sm:grid-cols-4"><div><p className="text-[10px] uppercase tracking-wider text-slate-500">Owner</p><p className="mt-1 font-semibold text-white">Mahesh R.</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-500">Asset ID</p><p className="mt-1 font-mono text-cyan-100">LAP-2048</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-500">Similarity</p><p className="mt-1 font-semibold text-emerald-300">96%</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p><p className="mt-1 flex items-center gap-2 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" /> Known asset</p></div></div></div>
          </div>
        </Card>

        <Card><CardContent><div className="flex items-center gap-3"><ScanLine className="h-5 w-5 text-cyan-200" /><div><h3 className="font-semibold text-white">Recent identification events</h3><p className="text-xs text-slate-500">Similarity threshold: 82%</p></div></div><div className="mt-5 space-y-3">{events.map((event) => <div key={event.time} className="rounded-xl border border-white/10 bg-white/[0.025] p-4"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${event.known ? "bg-emerald-300" : "bg-amber-300"}`} /><p className="font-medium text-white">{event.object} · {event.owner}</p></div><p className="mt-2 text-xs text-slate-500">{event.camera} · {event.time}</p></div><Badge variant={event.known ? "success" : "warning"}>{event.similarity}</Badge></div></div>)}</div></CardContent></Card>
      </div>

      <Card><CardContent><div className="flex items-center justify-between gap-4"><div><h3 className="font-semibold text-white">Registered asset directory</h3><p className="mt-1 text-sm text-slate-500">Enrollment health for the active workspace</p></div><Badge variant="accent">128 total</Badge></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="pb-3">Asset</th><th className="pb-3">Owner</th><th className="pb-3">Department</th><th className="pb-3">Training images</th><th className="pb-3">Status</th></tr></thead><tbody>{registry.map((item) => <tr key={item.id} className="border-b border-white/5"><td className="py-4"><p className="font-medium text-white">{item.asset}</p><p className="mt-1 font-mono text-xs text-slate-500">{item.id}</p></td><td className="py-4 text-slate-300">{item.owner}</td><td className="py-4 text-slate-400">{item.department}</td><td className="py-4 text-slate-300">{item.images}</td><td className="py-4"><Badge variant="success">{item.status}</Badge></td></tr>)}</tbody></table></div></CardContent></Card>
    </section>
  );
}
