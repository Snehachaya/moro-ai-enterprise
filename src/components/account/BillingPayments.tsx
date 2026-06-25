import { Download, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { billingSummary } from "@/data/account";

export function BillingPayments() {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Current Plan", value: billingSummary.currentPlan },
          { label: "Next Renewal", value: billingSummary.nextRenewal },
          { label: "Monthly Billing", value: billingSummary.monthlyBilling },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Recent Invoices</h2>
          <p className="mt-1 text-sm text-slate-500">Download billing records for finance and compliance review.</p>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-borderSubtle">
            <thead className="bg-white/[0.03]">
              <tr>
                {["Invoice", "Date", "Amount", "Status", "Action"].map((header) => (
                  <th key={header} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {billingSummary.invoices.map((invoice) => (
                <tr key={invoice.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-4 w-4 text-accent" aria-hidden="true" />
                      <span className="text-sm font-medium text-white">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{invoice.date}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{invoice.amount}</td>
                  <td className="px-5 py-4">
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>{invoice.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="ghost" size="sm">
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
