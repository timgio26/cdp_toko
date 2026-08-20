import {

  DollarSign,
  Receipt,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { useSalesDashboard } from "../../utils/SalesQuery";
// import { MetricCard } from "./MetricCard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { formatRupiah } from "../../utils/myfunction";
import { RevenueChart } from "./RevenueChart";
import { PaymentMethods } from "./PaymentMethod";
import { TopProducts } from "./TopProducts";
import { RecentSales } from "./RecentSales";
import { SummaryCard } from "../../Components/SummaryCard";

export default function SalesDashboard() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSalesDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <TrendingUp className="h-5 w-5" />
          </div>

          <h2 className="text-lg font-semibold text-zinc-900">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Something went wrong while loading your sales data.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const revenue = Number(data.summary.month.revenue);
  const todayRevenue = Number(data.summary.today.revenue);
  const averageOrder = Number(
    data.summary.month.average_order_value
  );

  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Live dashboard
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Sales overview
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Monitor your business performance and sales activity.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </header>

        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Revenue this month"
            value={formatRupiah(revenue)}
            description={`${data.summary.month.orders} orders`}
            icon={<DollarSign/>}
            // trend="+12.8%"
            // trendUp
          />

          <SummaryCard
            label="Today's revenue"
            value={formatRupiah(todayRevenue)}
            description={`${data.summary.today.orders} orders today`}
            icon={<TrendingUp/>}
            // trend="+8.2%"
            // trendUp
          />

          <SummaryCard
            label="Average order"
            value={formatRupiah(averageOrder)}
            description="Per completed order"
            icon={<Receipt/>}
            // trend="+4.6%"
            // trendUp
          />

          <SummaryCard
            label="Orders this month"
            value={data.summary.month.orders.toLocaleString()}
            description="Completed orders"
            icon={<ShoppingBag/>}
            // trend="+9.4%"
            // trendUp
          />
        </section>

        {/* Main analytics */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

          {/* Revenue chart */}
          <RevenueChart data={data.daily_sales} />

          {/* Payment methods */}
          <PaymentMethods data={data.payment_methods} />
        </section>

        {/* Bottom section */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">

          <TopProducts products={data.top_products} />

          <RecentSales sales={data.recent_sales} />
        </section>
      </div>
    </main>
  );
}