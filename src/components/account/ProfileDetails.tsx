import { Edit3, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { accountProfile } from "@/data/account";

const profileFields = [
  { label: "Full Name", value: accountProfile.fullName },
  { label: "Email Address", value: accountProfile.email },
  { label: "Phone Number", value: accountProfile.phone },
  { label: "Assigned Role", value: accountProfile.role, emphasis: true },
];

export function ProfileDetails() {
  return (
    <section>
      <Card className="overflow-hidden rounded-lg border-borderSubtle bg-[#0b0f14]/95">
        <CardContent className="grid gap-7 p-6 md:p-8 lg:grid-cols-[150px_minmax(0,1fr)]">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-cyan-300/30 bg-[radial-gradient(circle_at_35%_20%,rgba(6,182,212,0.55),transparent_32%),linear-gradient(135deg,#0f172a,#111827_45%,#020817)] shadow-[0_0_35px_rgba(6,182,212,0.18)]">
            <div className="absolute inset-4 rounded-xl border border-cyan-300/20 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-400/20 to-transparent" />
            <div className="absolute bottom-4 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border border-cyan-200/30 bg-slate-900 text-xl font-semibold text-white">
              MK
            </div>
            <button
              type="button"
              aria-label="Edit profile photo"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-slate-100 shadow-lg"
            >
              <Edit3 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{field.label}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {field.emphasis ? <span className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
                    <p className={field.emphasis ? "font-semibold text-cyan-200" : "font-medium text-white"}>{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" className="border-cyan-300/60 text-cyan-100 hover:bg-cyan-300/10">
                Edit Profile
              </Button>
              <Button variant="secondary">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
