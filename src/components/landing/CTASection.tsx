import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

export function CTASection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-[radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.18),transparent_34rem)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-5xl"
      >
        <Card className="overflow-hidden border-cyan-300/20 bg-[#06101f]/90">
          <div className="relative px-6 py-12 text-center sm:px-10 lg:px-16">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(6,182,212,0.12),transparent_42%,rgba(99,102,241,0.12))]" />
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Transform Security with MoroAI
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Bring robotics-grade vision AI into every site, camera, and response workflow that protects your
              organization.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <Mail className="h-5 w-5" aria-hidden="true" />
                Contact Sales
              </Button>
              <Link to={isAuthenticated ? routes.subscription : routes.login}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Pricing
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
