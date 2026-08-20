import { formatDate, formatRupiah } from "../../utils/myfunction";
import type { SalesDashboard } from "../../utils/SalesQuery";
import {

  Receipt,

  ShoppingBag,
} from "lucide-react";

export function RecentSales({
  sales,
}: {
  sales: SalesDashboard["recent_sales"];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-zinc-950">
            Recent transactions
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Latest completed sales
          </p>
        </div>

        <Receipt className="h-5 w-5 text-zinc-400" />
      </div>

      <div className="mt-6 divide-y divide-zinc-100">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-800">
                {sale.customer_name || "Walk-in customer"}
              </p>

              <p className="mt-0.5 text-xs text-zinc-400">
                {sale.invoice_number} ·{" "}
                {sale.payment_method}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900">
                {formatRupiah(Number(sale.total))}
              </p>

              <p className="mt-0.5 text-xs text-zinc-400">
                {sale.created_at&&formatDate(sale.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}