import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { AppLogo } from "@/components/common/AppLogo";
import { Card } from "@/components/ui/Card";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.65fr)]">
      <AuthVisualPanel />
      <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AppLogo className="mb-8 justify-center lg:hidden" />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <Card className="w-full border-cyan-300/15 bg-surface/90">
              {children}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
