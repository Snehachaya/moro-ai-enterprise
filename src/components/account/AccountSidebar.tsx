import { CreditCard, LogOut, PackageCheck, Repeat2, UserRound } from "lucide-react";
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
    <aside className="rounded-xl border border-borderSubtle bg-surface/80 p-4 shadow-glass backdrop-blur-xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Account Management</p>
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
                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition",
                isActive ? "bg-accentSoft text-cyan-100" : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Secured session
        </div>
        <p className="mt-2 text-xs leading-5 text-rose-100/70">Account changes are logged in the audit trail.</p>
      </div>
    </aside>
  );
}
