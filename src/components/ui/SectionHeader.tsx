import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-slate-400">{description}</p> : null}
    </div>
  );
}
