import { Download, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { billingSummary } from "@/data/account";

export function BillingPayments() {
  return (
    <section className="space-y-5">
      <Card className="rounded-lg border-borderSubtle bg-[#0b0f14]/95">
        <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
        {[
          { label: "Current Plan", value: billingSummary.currentPlan },
          { label: "Next Renewal", value: billingSummary.nextRenewal },
          { label: "Monthly Billing", value: billingSummary.monthlyBilling },
        ].map((item, index) => (
          <div key={item.label} className={index > 0 ? "border-borderSubtle md:border-l md:pl-8" : ""}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <p className={item.label === "Monthly Billing" ? "mt-2 text-xl font-semibold text-cyan-100" : "mt-2 text-xl text-white"}>
              {item.value}
            </p>
          </div>
        ))}
          <Button variant="secondary" className="border-cyan-300/60 px-8 text-cyan-100 hover:bg-cyan-300/10">
            Manage Subscription
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-lg border-borderSubtle bg-[#0b0f14]/95">
        <CardHeader className="border-b border-borderSubtle bg-white/[0.03] px-6 py-5">
          <h2 className="text-base font-medium text-white">Recent Invoices</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-borderSubtle">
            <thead className="bg-white/[0.03]">
              <tr>
                {["Invoice ID", "Date", "Amount", "Status", "Action"].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {billingSummary.invoices.map((invoice) => (
                <tr key={invoice.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      <span className="font-medium text-white">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300">{invoice.date}</td>
                  <td className="px-6 py-5 font-semibold text-white">{invoice.amount}</td>
                  <td className="px-6 py-5">
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>{invoice.status}</Badge>
                  </td>
                  <td className="px-6 py-5">
                    <Button variant="ghost" size="sm" className="text-cyan-100">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
