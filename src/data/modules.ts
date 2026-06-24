import type { DetectionModule } from "@/types/module";

export const detectionModules: DetectionModule[] = [
  {
    id: "human",
    name: "Human Detection",
    summary: "Identity-aware recognition for visitors, employees, and unusual human activity.",
    capabilities: ["Face recognition", "Gesture analysis", "Unknown visitor detection"],
    accent: "cyan",
  },
  {
    id: "object",
    name: "Object Detection",
    summary: "Classifies operational assets, electronics, unattended items, and animals.",
    capabilities: ["Asset classification", "Unattended object alerts", "Pet and animal detection"],
    accent: "blue",
  },
  {
    id: "threat",
    name: "Threat Detection",
    summary: "Detects smoke, fire, intrusion, robbery patterns, and active risk events.",
    capabilities: ["Fire and smoke", "Intrusion events", "Robbery signals"],
    accent: "red",
  },
  {
    id: "weapon",
    name: "Weapon Detection",
    summary: "Identifies firearms, knives, and blunt tools across supported camera feeds.",
    capabilities: ["Gun identification", "Knife detection", "Blunt tool recognition"],
    accent: "rose",
  },
  {
    id: "accident",
    name: "Accident Detection",
    summary: "Monitors for vehicle collisions, human falls, and emergency motion patterns.",
    capabilities: ["Vehicle collision", "Human fall", "Medical emergency"],
    accent: "emerald",
  },
];
