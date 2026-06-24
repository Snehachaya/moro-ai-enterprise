export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
  highlighted?: boolean;
}
