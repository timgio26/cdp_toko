import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatRupiah } from "../../utils/myfunction";

interface RevenueChartProps {
  data: {
    date: string;
    orders: number;
    revenue: string;
  }[];
}

function formatChartDate(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return new Date(value).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    revenue: Number(item.revenue),
  }));

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-zinc-950">Revenue performance</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Revenue over the last 7 days
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-500">
          Last 7 days
        </div>
      </div>

      <div className="mt-8 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 5,
              left: 5,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopOpacity={0.2} />
                <stop offset="100%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {
                  weekday: "short",
                })
              }
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
              }}
              tickFormatter={(value) => formatRupiah(Number(value))}
            />

            <Tooltip
              cursor={{
                strokeDasharray: "4 4",
              }}
              formatter={(value) => formatRupiah(Number(value))}
              labelFormatter={formatChartDate}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
