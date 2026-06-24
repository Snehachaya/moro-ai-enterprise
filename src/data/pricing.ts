import type { PricingPlan } from "@/types/commerce";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 499,
    billingCycle: "monthly",
    features: ["25 camera nodes", "Core detection modules", "7-day evidence retention"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 2499,
    billingCycle: "monthly",
    highlighted: true,
    features: ["Unlimited sites", "Advanced analytics", "90-day evidence retention", "Priority support"],
  },
  {
    id: "sovereign",
    name: "Sovereign Cloud",
    price: 6499,
    billingCycle: "monthly",
    features: ["Private deployment", "Custom compliance controls", "Dedicated security engineering"],
  },
];
