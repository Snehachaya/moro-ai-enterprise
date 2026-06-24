export type DetectionModuleId = "human" | "object" | "threat" | "weapon" | "accident";

export interface DetectionModule {
  id: DetectionModuleId;
  name: string;
  summary: string;
  capabilities: string[];
  accent: "cyan" | "blue" | "red" | "rose" | "emerald";
}
