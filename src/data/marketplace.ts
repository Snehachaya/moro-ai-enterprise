import {
  AlertTriangle,
  Boxes,
  Cross,
  Fingerprint,
  ShieldCheck,
  ShieldQuestion,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/routes/paths";

export type MarketplaceCategory = "Identity" | "Assets" | "Risk" | "Weapons" | "Emergency" | "Bundle";

export interface MarketplaceModule {
  id: string;
  name: string;
  category: MarketplaceCategory;
  description: string;
  features: string[];
  price: number;
  billingCycle: "month";
  icon: LucideIcon;
  route?: string;
  highlighted?: boolean;
}

export const marketplaceModules: MarketplaceModule[] = [
  {
    id: "human-detection",
    name: "Human Detection",
    category: "Identity",
    description: "Recognize known visitors, unknown people, and behavior cues across secured sites.",
    features: ["Face recognition", "Visitor classification", "Gesture intelligence"],
    price: 499,
    billingCycle: "month",
    icon: UserRoundSearch,
    route: routes.humanDetection,
  },
  {
    id: "object-detection",
    name: "Object Detection",
    category: "Assets",
    description: "Detect electronics, assets, unattended items, and animals in operational zones.",
    features: ["Asset tagging", "Unattended objects", "Animal detection"],
    price: 399,
    billingCycle: "month",
    icon: Boxes,
    route: routes.objectDetection,
  },
  {
    id: "asset-owner-identification",
    name: "Asset Owner Identification",
    category: "Assets",
    description: "Match detected equipment to registered owners and surface unknown assets for review.",
    features: ["Owner matching", "Asset enrollment", "Unknown asset queue"],
    price: 449,
    billingCycle: "month",
    icon: Fingerprint,
    route: routes.assetOwnerIdentification,
  },
  {
    id: "threat-detection",
    name: "Threat Detection",
    category: "Risk",
    description: "Identify active security risks including smoke, intrusion, and robbery patterns.",
    features: ["Fire and smoke", "Intrusion events", "Robbery signals"],
    price: 699,
    billingCycle: "month",
    icon: AlertTriangle,
    route: routes.threatDetection,
  },
  {
    id: "weapon-detection",
    name: "Weapon Detection",
    category: "Weapons",
    description: "Escalate weapon-like detections with confidence scoring and review context.",
    features: ["Gun identification", "Knife detection", "Blunt tool alerts"],
    price: 599,
    billingCycle: "month",
    icon: ShieldQuestion,
    route: routes.weaponDetection,
  },
  {
    id: "accident-detection",
    name: "Accident Detection",
    category: "Emergency",
    description: "Surface urgent events like falls, collisions, and medical emergency signals.",
    features: ["Vehicle collision", "Human fall", "Medical emergency"],
    price: 799,
    billingCycle: "month",
    icon: Cross,
    route: routes.accidentDetection,
  },
  {
    id: "master-sentinel-suite",
    name: "Master Sentinel Suite",
    category: "Bundle",
    description: "Complete MoroAI protection suite with every detection module and priority updates.",
    features: ["All six modules", "Bundle savings", "Priority model upgrades"],
    price: 2499,
    billingCycle: "month",
    icon: ShieldCheck,
    highlighted: true,
  },
];

export const marketplaceBundles = marketplaceModules.filter((module) => module.highlighted);
