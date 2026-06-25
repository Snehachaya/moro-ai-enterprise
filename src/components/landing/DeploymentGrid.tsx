import { Building2, GraduationCap, Home, Hospital, ParkingCircle, Store, Warehouse, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const deployments = [
  { label: "Smart Homes", icon: Home },
  { label: "Shops", icon: Store },
  { label: "Offices", icon: Building2 },
  { label: "Industries", icon: Workflow },
  { label: "Schools", icon: GraduationCap },
  { label: "Hospitals", icon: Hospital },
  { label: "Warehouses", icon: Warehouse },
  { label: "Parking Areas", icon: ParkingCircle },
];

export function DeploymentGrid() {
  return (
    <section id="solutions" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader align="center" title="Universal Deployment" description="Designed for every environment where camera intelligence needs to be reliable, private, and fast." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deployments.map((deployment, index) => {
            const Icon = deployment.icon;
            return (
              <motion.div
                key={deployment.label}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.03, duration: 0.22 }}
              >
                <Card className="flex min-h-28 items-center justify-center p-6 text-center transition hover:border-cyan-300/30 hover:bg-surfaceElevated">
                  <div>
                    <Icon className="mx-auto h-6 w-6 text-cyan-200" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-slate-200">{deployment.label}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
