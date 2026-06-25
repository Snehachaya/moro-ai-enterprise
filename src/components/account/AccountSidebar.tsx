import { CreditCard, PackageCheck, Repeat2, UserRound } from "lucide-react";
import { cn } from "@/utils/cn";

export type AccountSection = "details" | "modules" | "billing" | "switch";

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
}

const sidebarItems = [
  { id: "details", label: "Account Details", icon: UserRound },
  { id: "modules", label: "Purchased Modules", icon: PackageCheck },
  { id: "billing", label: "Billing & Payments", icon: CreditCard },
  { id: "switch", label: "Switch Account", icon: Repeat2 },
] satisfies Array<{ id: AccountSection; label: string; icon: typeof UserRound }>;

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  return (
    <aside className="h-fit border-r border-borderSubtle/80 bg-[#080d16]/70 p-4 shadow-glass backdrop-blur-xl lg:min-h-full">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Account Management</p>
      <nav className="space-y-2" aria-label="Account sections">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-3 text-left text-sm font-medium transition",
                isActive
                  ? "border-cyan-300 bg-[#172239] text-cyan-100 shadow-[0_0_24px_rgba(6,182,212,0.12)]"
                  : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
