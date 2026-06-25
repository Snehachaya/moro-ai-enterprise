import { KeyRound, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { accountProfile } from "@/data/account";

const profileFields = [
  { label: "Full name", value: accountProfile.fullName, icon: UserRound },
  { label: "Email", value: accountProfile.email, icon: Mail },
  { label: "Phone", value: accountProfile.phone, icon: Phone },
  { label: "Role", value: accountProfile.role, icon: ShieldCheck },
];

export function ProfileDetails() {
  return (
    <section className="space-y-5">
      <Card className="overflow-hidden border-cyan-300/20 bg-[#06101f]/90">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="rounded-xl border border-borderSubtle bg-white/[0.03] p-5 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-300/20 bg-accentSoft text-3xl font-semibold text-cyan-100">
              MK
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{accountProfile.fullName}</h2>
            <p className="mt-1 text-sm text-slate-500">{accountProfile.workspace}</p>
          </div>
          <div>
            <div className="grid gap-4 md:grid-cols-2">
              {profileFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.label} className="rounded-xl border border-borderSubtle bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">{field.label}</p>
                        <p className="mt-1 font-medium text-white">{field.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button>Edit Profile</Button>
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
