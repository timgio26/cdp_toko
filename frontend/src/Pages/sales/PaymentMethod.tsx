import { formatRupiah } from "../../utils/myfunction";
import {

CreditCard
} from "lucide-react";

interface PaymentMethodsProps {
  data: {
    method: string;
    orders: number;
    revenue: string;
  }[];
}

export function PaymentMethods({ data }: PaymentMethodsProps) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.revenue),
    0
  );

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div>
        <h2 className="font-semibold text-zinc-950">
          Payment methods
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Revenue distribution
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {data.map((item) => {
          const percentage =
            total > 0
              ? (Number(item.revenue) / total) * 100
              : 0;

          return (
            <div key={item.method}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                    <CreditCard className="h-4 w-4 text-zinc-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium capitalize text-zinc-800">
                      {item.method}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {item.orders} orders
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900">
                    {formatRupiah(Number(item.revenue))}
                  </p>

                  <p className="text-xs text-zinc-400">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}