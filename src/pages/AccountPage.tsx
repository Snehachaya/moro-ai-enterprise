import { useSearchParams } from "react-router-dom";
import { AccountSidebar, type AccountSection } from "@/components/account/AccountSidebar";
import { BillingPayments } from "@/components/account/BillingPayments";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import { PurchasedModules } from "@/components/account/PurchasedModules";
import { SwitchAccount } from "@/components/account/SwitchAccount";

const sectionTitles: Record<AccountSection, { title: string; description: string }> = {
  details: {
    title: "Account Details",
    description: "",
  },
  modules: {
    title: "Purchased Modules",
    description: "5 active intelligence systems running",
  },
  billing: {
    title: "Billing & Payments",
    description: "",
  },
  switch: {
    title: "Switch Account",
    description: "",
  },
};

export function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: AccountSection =
    sectionParam === "modules" || sectionParam === "billing" || sectionParam === "switch" ? sectionParam : "details";
  const section = sectionTitles[activeSection];

  function handleSectionChange(nextSection: AccountSection) {
    if (nextSection === "details") {
      setSearchParams({});
      return;
    }

    setSearchParams({ section: nextSection });
  }

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <div className="grid min-h-[calc(100vh-120px)] gap-6 lg:grid-cols-[232px_minmax(0,1fr)]">
        <AccountSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <main className="min-w-0 space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{section.title}</h1>
            {section.description ? <p className="mt-1 text-sm text-slate-400">{section.description}</p> : null}
          </div>
          {activeSection === "details" ? <ProfileDetails /> : null}
          {activeSection === "modules" ? <PurchasedModules /> : null}
          {activeSection === "billing" ? <BillingPayments /> : null}
          {activeSection === "switch" ? <SwitchAccount /> : null}
        </main>
      </div>
    </div>
  );
}
