export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  workspace: string;
}

export interface PurchasedModule {
  id: string;
  name: string;
  status: "Active";
  usage: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Processing";
}

export interface BillingSummary {
  currentPlan: string;
  nextRenewal: string;
  monthlyBilling: string;
  invoices: Invoice[];
}

export const accountProfile: AccountProfile = {
  fullName: "Mahesh Kumar",
  email: "mahesh.k@moroai.systems",
  phone: "+91 98765 43210",
  role: "Senior Operator",
  workspace: "Enterprise Workspace",
};

export const purchasedModules: PurchasedModule[] = [
  { id: "human", name: "Human Detection", status: "Active", usage: 86 },
  { id: "object", name: "Object Detection", status: "Active", usage: 74 },
  { id: "threat", name: "Threat Detection", status: "Active", usage: 62 },
  { id: "weapon", name: "Weapon Detection", status: "Active", usage: 41 },
  { id: "accident", name: "Accident Detection", status: "Active", usage: 57 },
];

export const billingSummary: BillingSummary = {
  currentPlan: "Enterprise Pro",
  nextRenewal: "January 12, 2025",
  monthlyBilling: "$1,240.00",
  invoices: [
    { id: "INV-2025-001", date: "January 12, 2025", amount: "$1,240.00", status: "Paid" },
    { id: "INV-2024-012", date: "December 12, 2024", amount: "$1,240.00", status: "Paid" },
    { id: "INV-2024-011", date: "November 12, 2024", amount: "$1,180.00", status: "Paid" },
    { id: "INV-2024-010", date: "October 12, 2024", amount: "$1,180.00", status: "Processing" },
  ],
};
