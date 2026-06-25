export type DetectionModuleId = "human" | "object" | "threat" | "weapon" | "accident";

export interface DetectionModule {
  id: DetectionModuleId;
  name: string;
  route: string;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  features: string[];
  workflow: string[];
  price?: string;
  pricingNote?: string;
  metric: {
    label: string;
    value: string;
  };
  accent: "cyan" | "blue" | "red" | "rose" | "emerald";
}
