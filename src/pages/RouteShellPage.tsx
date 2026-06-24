import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface RouteShellPageProps {
  title: string;
  area: string;
}

export function RouteShellPage({ title, area }: RouteShellPageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mx-auto max-w-7xl"
    >
      <Card>
        <CardContent className="p-8">
          <Badge variant="accent">{area}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            This route is registered in the production application shell. Feature implementation will be added in the
            next build phase after the foundation compiles cleanly.
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
