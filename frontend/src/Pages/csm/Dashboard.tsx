import { useGetDashboard } from "../../utils/customerQuery";

export default function Dashboard() {
  const { data, isLoading, isError } = useGetDashboard();
  // console.log(data)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Unable to load dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your customers and service activity.
        </p>
      </div>
      {/* =====================================================
      STAT CARDS
  ===================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Customers</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.stats.customers}
          </p>
        </div>

        {/* Addresses */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Addresses</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.stats.addresses}
          </p>
        </div>

        {/* Services */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Services</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.stats.services}
          </p>
        </div>

        {/* Services this month */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Services This Month</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.stats.services_this_month}
          </p>
        </div>

        {/* New customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">New Customers</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.stats.new_customers_this_month}
          </p>

          <p className="mt-1 text-xs text-gray-400">This month</p>
        </div>
      </div>

      {/* =====================================================
    SECOND ROW
===================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Service Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">Service Activity</h2>

            <p className="text-sm text-gray-500">
              Number of services recorded over the last 12 months
            </p>
          </div>

          <div className="flex h-64 items-end gap-2">
            {data.services_by_month.map((item) => {
              const maxServices = Math.max(
                ...data.services_by_month.map((month) => month.count),
                1,
              );

              const height = (item.count / maxServices) * 100;

              const [year, month] = item.month.split("-");

              const label = new Date(
                Number(year),
                Number(month) - 1,
              ).toLocaleDateString("en-US", {
                month: "short",
              });

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* Count */}
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    {item.count}
                  </p>

                  {/* Bar */}
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
                      style={{
                        height: `${height}%`,
                        minHeight: item.count > 0 ? "4px" : "0px",
                      }}
                      title={`${item.count} services`}
                    />
                  </div>

                  {/* Month */}
                  <p className="mt-2 text-xs text-gray-400">{label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address Categories */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Address Categories</h2>

            <p className="text-sm text-gray-500">
              Distribution of customer addresses
            </p>
          </div>

          <div className="space-y-5">
            {data.categories.map((category) => {
              const total = data.stats.addresses;

              const percentage =
                total > 0 ? Math.round((category.count / total) * 100) : 0;

              return (
                <div key={category.name ?? "uncategorized"}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {category.name ?? "Uncategorized"}
                    </span>

                    <span className="text-gray-500">
                      {category.count} ({percentage}%)
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
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
      </div>
      
      {/* =====================================================
      ATTENTION
  ===================================================== */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">Attention Needed</h2>

          <p className="text-sm text-gray-500">
            Customers and locations without service activity
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm font-medium text-yellow-800">
              Customers Without Services
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-900">
              {data.attention.customers_without_services}
            </p>

            <p className="mt-1 text-xs text-yellow-700">
              Customers that have no recorded service
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm font-medium text-yellow-800">
              Addresses Without Services
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-900">
              {data.attention.addresses_without_services}
            </p>

            <p className="mt-1 text-xs text-yellow-700">
              Locations that have no recorded service
            </p>
          </div>
        </div>
      </div>
      {/* =====================================================
      BOTTOM
  ===================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Services */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">Recent Services</h2>

            <p className="text-sm text-gray-500">
              Latest recorded service activity
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <th className="pb-3 pr-4">Customer</th>

                  <th className="pb-3 pr-4">Address</th>

                  <th className="pb-3 pr-4">Date</th>

                  <th className="pb-3">Result</th>
                </tr>
              </thead>

              <tbody>
                {data.recent_services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium text-gray-900">
                      {service.customer}
                    </td>

                    <td className="py-4 pr-4 text-gray-600">
                      {service.address}
                    </td>

                    <td className="py-4 pr-4 text-gray-500">{service.date}</td>

                    <td className="py-4">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {service.result ?? "No result"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">
              Most Active Customers
            </h2>

            <p className="text-sm text-gray-500">
              Customers with the most services
            </p>
          </div>

          <div className="space-y-5">
            {data.top_customers.map((customer, index) => (
              <div key={customer.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {customer.name}
                  </p>

                  <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(customer.services * 2, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="text-sm font-semibold text-gray-700">
                  {customer.services}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
