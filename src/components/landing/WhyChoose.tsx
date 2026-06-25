import { Cloud, Gauge, Globe2, Lock, PlugZap, Radar, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const benefits = [
  {
    title: "24/7 Monitoring",
    description: "Constant autonomous vigilance without human fatigue.",
    icon: Radar,
  },
  {
    title: "Cloud Evidence",
    description: "Encrypted evidence storage for review, export, and forensic analysis.",
    icon: Cloud,
  },
  {
    title: "Enterprise Scale",
    description: "Scale from one site to thousands of camera nodes with consistent policy.",
    icon: Scale,
  },
  {
    title: "Privacy First",
    description: "Edge processing patterns keep sensitive camera data closer to source.",
    icon: Lock,
  },
  {
    title: "Low Latency",
    description: "Real-time alerts designed for fast incident response workflows.",
    icon: Gauge,
  },
  {
    title: "Smart Integration",
    description: "Works with existing IP cameras and connected security infrastructure.",
    icon: PlugZap,
  },
  {
    title: "Precision Models",
    description: "Purpose-trained models reduce noisy detections across busy environments.",
    icon: ShieldCheck,
  },
  {
    title: "Global Support",
    description: "Deployment guidance for complex sites, regions, and compliance needs.",
    icon: Globe2,
  },
];

export function WhyChoose() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader align="center" title="Why Choose MoroAI" description="A security platform built for operational teams that need speed, accuracy, and enterprise control." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.03, duration: 0.22 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="mt-5 text-base font-semibold text-white">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
