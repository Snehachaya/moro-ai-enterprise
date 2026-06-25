import { useState } from "react";
import { AccountSidebar, type AccountSection } from "@/components/account/AccountSidebar";
import { BillingPayments } from "@/components/account/BillingPayments";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import { PurchasedModules } from "@/components/account/PurchasedModules";
import { SwitchAccount } from "@/components/account/SwitchAccount";

const sectionTitles: Record<AccountSection, { title: string; description: string }> = {
  details: {
    title: "Account Details",
    description: "Manage operator identity, contact information, and secure access settings.",
  },
  modules: {
    title: "Purchased Modules",
    description: "Review active AI modules, usage health, and marketplace expansion options.",
  },
  billing: {
    title: "Billing & Payments",
    description: "Track subscription plan, renewals, invoices, and payment records.",
  },
  switch: {
    title: "Switch Account",
    description: "Move between MoroAI accounts or sign out of the current workspace.",
  },
};

export function AccountPage() {
  const [activeSection, setActiveSection] = useState<AccountSection>("details");
  const section = sectionTitles[activeSection];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Account Management</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{section.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-400">{section.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div>
          {activeSection === "details" ? <ProfileDetails /> : null}
          {activeSection === "modules" ? <PurchasedModules /> : null}
          {activeSection === "billing" ? <BillingPayments /> : null}
          {activeSection === "switch" ? <SwitchAccount /> : null}
        </div>
      </div>
    </div>
  );
}
