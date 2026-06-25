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
  expires: string;
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
  workspace: "Enterprise Workspace (Systems Group)",
};

export const purchasedModules: PurchasedModule[] = [
  { id: "human", name: "Human Detection", status: "Active", usage: 86, expires: "Dec 2024" },
  { id: "object", name: "Object Detection", status: "Active", usage: 92, expires: "Dec 2024" },
  { id: "threat", name: "Threat Detection", status: "Active", usage: 70, expires: "Dec 2024" },
  { id: "weapon", name: "Weapon Detection", status: "Active", usage: 61, expires: "Dec 2024" },
  { id: "accident", name: "Accident Detection", status: "Active", usage: 82, expires: "Dec 2024" },
];

export const billingSummary: BillingSummary = {
  currentPlan: "Enterprise Pro",
  nextRenewal: "January 12, 2025",
  monthlyBilling: "$1,240.00",
  invoices: [
    { id: "#INV-2024-012", date: "Dec 12, 2024", amount: "$1,240.00", status: "Paid" },
    { id: "#INV-2024-011", date: "Nov 12, 2024", amount: "$1,240.00", status: "Paid" },
  ],
};
