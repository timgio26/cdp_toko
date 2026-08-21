import { formatRupiah } from "../../utils/myfunction";
import type { SalesDashboard } from "../../utils/SalesQuery";
import {
Package
} from "lucide-react";

export function TopProducts({
  products,
}: {
  products: SalesDashboard["top_products"];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-zinc-950">
            Top products
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Best performing products this month
          </p>
        </div>

        <Package className="h-5 w-5 text-zinc-400" />
      </div>

      <div className="mt-6 divide-y divide-zinc-100">
        {products.map((product, index) => (
          <div
            key={product.product_id ?? product.sku}
            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-500">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-800">
                {product.name}
              </p>

              <p className="mt-0.5 text-xs text-zinc-400">
                {product.sku} · {product.quantity} sold
              </p>
            </div>

            <p className="text-sm font-semibold text-zinc-900">
              {formatRupiah(Number(product.revenue))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}