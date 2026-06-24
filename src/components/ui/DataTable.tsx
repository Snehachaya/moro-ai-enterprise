import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface DataTableColumn<TData> {
  key: keyof TData | string;
  header: string;
  render: (row: TData) => ReactNode;
  className?: string;
}

interface DataTableProps<TData> {
  rows: TData[];
  columns: DataTableColumn<TData>[];
  getRowId: (row: TData) => string;
  emptyLabel?: string;
}

export function DataTable<TData>({ rows, columns, getRowId, emptyLabel = "No records found." }: DataTableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-xl border border-borderSubtle">
      <table className="min-w-full divide-y divide-borderSubtle">
        <thead className="bg-white/[0.03]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borderSubtle bg-surface/40">
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={getRowId(row)} className="transition hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn("px-4 py-3 text-sm text-slate-300", column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-400">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
