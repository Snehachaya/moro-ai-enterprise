import { Link } from "react-router-dom";
import { ArrowRight, Boxes, CheckCircle2, ShieldAlert, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { routes } from "@/routes/paths";

const modules = [
  { label: "Human Detection", icon: UserRoundSearch },
  { label: "Object Detection", icon: Boxes },
  { label: "Threat Detection", icon: ShieldAlert },
];

export function WelcomePanel() {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="text-center">
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
        >
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </motion.span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Verified</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Welcome to MoroAI</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your workspace is ready. Choose modules and subscription settings to complete setup.
        </p>
      </div>

      <div className="grid gap-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.label} className="bg-white/[0.03] shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-white">{module.label}</p>
                  <p className="text-sm text-slate-500">Available in your module marketplace.</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Link to={routes.marketplace} className="block">
        <Button className="w-full" size="lg">
          Choose subscription
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </Link>
      <Link to={routes.dashboard} className="block text-center text-sm font-medium text-slate-300 transition hover:text-white">
        Continue to dashboard
      </Link>
    </div>
  );
}
