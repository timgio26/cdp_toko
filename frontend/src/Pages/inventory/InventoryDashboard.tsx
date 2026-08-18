import {
  FiActivity,
  FiAlertCircle,
  FiBox,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { useDashboard } from "../../utils/inventoryQuery";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function InventoryDashboard() {
  const {
    dashboard,
    isPending,
    isError,
    error,
    refetch,
  } = useDashboard();

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 text-center shadow-sm">
        <FiAlertCircle size={32} className="text-red-500" />

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Unable to load dashboard
        </h2>

        <p className="mt-1 max-w-md text-sm text-slate-500">
          {(error as any)?.response?.data?.error ??
            "Something went wrong while loading the dashboard."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <FiRefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  const {
    summary,
    movement_summary,
    daily_activity,
    category_value,
    top_products,
    most_active_products,
    attention,
    recent_movements,
  } = dashboard;

  const maxDailyValue = Math.max(
    ...daily_activity.map((item) =>
      Math.max(item.inbound, item.outbound),
    ),
    1,
  );

  const maxCategoryValue = Math.max(
    ...category_value.map(
      (item) => item.inventory_value,
    ),
    1,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Inventory
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your inventory, stock movement, and
            current attention items.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 sm:self-auto"
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<FiPackage size={19} />}
          label="Total Products"
          value={formatNumber(summary.total_products)}
          description="Products in inventory"
        />

        <SummaryCard
          icon={<FiBox size={19} />}
          label="Total Stock Units"
          value={formatNumber(summary.total_stock_units)}
          description="Current available units"
        />

        <SummaryCard
          icon={<FiDollarSign size={19} />}
          label="Inventory Value"
          value={formatCurrency(summary.inventory_value)}
          description="Current stock × unit price"
        />

        <SummaryCard
          icon={<FiAlertCircle size={19} />}
          label="Out of Stock"
          value={formatNumber(summary.out_of_stock)}
          description="Products with zero stock"
        />
      </div>

      {/* Movement summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <FiTrendingUp
                size={18}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Inbound
              </p>

              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {formatNumber(
                  movement_summary.inbound_units,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <FiTrendingDown
                size={18}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Outbound
              </p>

              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {formatNumber(
                  movement_summary.outbound_units,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <FiActivity
                size={18}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Net Change
              </p>

              <p
                className={`mt-0.5 text-xl font-bold ${
                  movement_summary.net_change >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {movement_summary.net_change > 0
                  ? "+"
                  : ""}
                {formatNumber(
                  movement_summary.net_change,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <FiClock
                size={18}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Movements
              </p>

              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {formatNumber(
                  movement_summary.movement_count,
                )}
              </p>

              <p className="text-xs text-slate-400">
                Last {movement_summary.period_days} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity + Category */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Stock Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Last {movement_summary.period_days} days
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-800" />
                <span className="text-slate-500">
                  Inbound
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="text-slate-500">
                  Outbound
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {daily_activity.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                No movement activity in this period.
              </div>
            ) : (
              <div className="flex h-56 items-end gap-1 overflow-x-auto pb-6">
                {daily_activity.map((item) => {
                  const inboundHeight =
                    (item.inbound / maxDailyValue) * 100;

                  const outboundHeight =
                    (item.outbound / maxDailyValue) * 100;

                  return (
                    <div
                      key={item.date}
                      className="group flex min-w-[18px] flex-1 items-end justify-center gap-0.5"
                    >
                      <div className="relative flex h-full w-2 items-end">
                        <div
                          className="w-full rounded-t bg-slate-800 transition-opacity group-hover:opacity-80"
                          style={{
                            height: `${Math.max(
                              inboundHeight,
                              item.inbound > 0 ? 4 : 0,
                            )}%`,
                          }}
                          title={`${item.date}: +${item.inbound}`}
                        />
                      </div>

                      <div className="relative flex h-full w-2 items-end">
                        <div
                          className="w-full rounded-t bg-slate-300 transition-opacity group-hover:opacity-80"
                          style={{
                            height: `${Math.max(
                              outboundHeight,
                              item.outbound > 0 ? 4 : 0,
                            )}%`,
                          }}
                          title={`${item.date}: -${item.outbound}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400">
              <span>
                {daily_activity[0]
                  ? formatDate(daily_activity[0].date)
                  : ""}
              </span>

              <span>
                {daily_activity.length > 0
                  ? formatDate(
                      daily_activity[
                        daily_activity.length - 1
                      ].date,
                    )
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Category value */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Inventory Value by Category
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Where your inventory value is concentrated
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {category_value.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                No category data available.
              </p>
            ) : (
              category_value.slice(0, 6).map((item) => {
                const percentage =
                  (item.inventory_value /
                    maxCategoryValue) *
                  100;

                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {item.category}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatNumber(
                            item.product_count,
                          )}{" "}
                          products
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatCurrency(
                          item.inventory_value,
                        )}
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-800"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Attention */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Out of stock */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Out of Stock
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Products that need restocking
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
              {summary.out_of_stock}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {attention.out_of_stock.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No products are out of stock.
              </div>
            ) : (
              attention.out_of_stock
                .slice(0, 6)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {product.sku}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                      Out of stock
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Missing supplier */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Missing Supplier
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Products without an assigned supplier
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
              {summary.products_without_supplier}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {attention.products_without_supplier
              .length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                All products have suppliers assigned.
              </div>
            ) : (
              attention.products_without_supplier
                .slice(0, 6)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {product.sku}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                      No supplier
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Top products + Active products */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top inventory value */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Top Inventory Value
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Products with the highest current stock value
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {top_products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    {product.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.sku} ·{" "}
                      {formatNumber(product.quantity)}{" "}
                      {product.unit}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatCurrency(
                    product.inventory_value,
                  )}
                </p>
              </div>
            ))}

            {top_products.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No product data available.
              </div>
            )}
          </div>
        </div>

        {/* Most active */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Most Active Products
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Products with the most stock movements
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {most_active_products.map((product) => (
              <div
                key={product.product_id}
                className="px-5 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {product.product_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.product_sku}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    {product.movements}{" "}
                    {product.movements === 1
                      ? "movement"
                      : "movements"}
                  </span>
                </div>

                <div className="mt-3 flex gap-4 text-xs">
                  <span className="text-slate-500">
                    In:{" "}
                    <strong className="text-slate-700">
                      +{formatNumber(product.inbound)}
                    </strong>
                  </span>

                  <span className="text-slate-500">
                    Out:{" "}
                    <strong className="text-slate-700">
                      -{formatNumber(product.outbound)}
                    </strong>
                  </span>
                </div>
              </div>
            ))}

            {most_active_products.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No movement activity available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent movements */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Stock Movements
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest inventory activity
            </p>
          </div>

          <FiActivity
            size={18}
            className="text-slate-400"
          />
        </div>

        <div className="divide-y divide-slate-100">
          {recent_movements.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">
              No stock movements yet.
            </div>
          ) : (
            recent_movements.map((movement) => {
              const inbound =
                movement.quantity_change > 0;

              return (
                <div
                  key={movement.id}
                  className="flex items-start gap-3 px-5 py-4"
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      inbound
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {inbound ? (
                      <FiTrendingUp size={16} />
                    ) : (
                      <FiTrendingDown size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {movement.product_name}
                      </p>

                      <span
                        className={`shrink-0 text-sm font-semibold ${
                          inbound
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {inbound ? "+" : ""}
                        {formatNumber(
                          movement.quantity_change,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {movement.product_sku}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {movement.reason}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatRelativeTime(
                        movement.created_at,
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer insight */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
            <FiUsers size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Supplier coverage
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {summary.products_without_supplier ===
              0
                ? "Every product currently has at least one supplier assigned."
                : `${formatNumber(
                    summary.products_without_supplier,
                  )} products still need a supplier assignment.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}