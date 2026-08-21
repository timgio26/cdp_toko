import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiChevronDown,
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiTrash2,
  FiX,
  FiDownload,
  FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { Pagination } from "../../Components/Pagination";
import { useState } from "react";
import { useCancelSale, useSales, type Sale } from "../../utils/SalesQuery";
import { useDebounce } from "../../utils/utilsHook";
import { DeleteConfirmModal } from "../../Components/DeleteConfirmModal";
import { formatRupiah, formatDate, downloadData } from "../../utils/myfunction";


export default function SalesHistory() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [cancelSale, setCancelSale] = useState<Sale | null>(null);
  const { cancelSale: cancelInvoice, isCancelling } = useCancelSale();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { sales, pagination, isPending, isError, error } = useSales({
    page,
    per_page: 20,
    search: debouncedSearch,
    status,
    payment_method: paymentMethod,
    date_from: dateFrom,
    date_to: dateTo,
  });
  const totalPages = pagination.pages ?? 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentMethod("");
    setDateFrom("");
    setDateTo("");
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  };



  async function handleDownload() {
    setIsDownloading(true);
    await downloadData("/api/sales/export","sales");
    setIsDownloading(false);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sales History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your completed and pending sales.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="
    inline-flex items-center justify-center gap-2
    rounded-lg
    border border-slate-200
    bg-white
    px-4 py-2.5
    text-sm font-semibold text-slate-700
    transition
    hover:bg-slate-50
    focus:outline-none
    focus:ring-4
    focus:ring-slate-100
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
          >
            {isDownloading ? (
              <>
                <FiLoader size={17} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FiDownload size={17} />
                Export Excel
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/sales/create-invoice")}
            className="
        inline-flex items-center justify-center gap-2
        rounded-lg
        bg-blue-600
        px-4 py-2.5
        text-sm font-semibold text-white
        transition
        hover:bg-blue-700
        focus:outline-none
        focus:ring-4
        focus:ring-blue-100
      "
          >
            <FiPlus size={17} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              size={17}
              className="
                pointer-events-none
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search invoice or customer..."
              className="
                h-10 w-full rounded-lg
                border border-slate-200
                bg-white
                pl-10 pr-4
                text-sm text-slate-800
                outline-none
                placeholder:text-slate-400
                transition
                hover:border-slate-300
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>

          {/* Status */}
          <div className="relative">
            <FiFilter
              size={15}
              className="
                pointer-events-none
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <select
              value={status}
              onChange={handleStatusChange}
              className="
                h-10 min-w-[140px]
                appearance-none
                rounded-lg
                border border-slate-200
                bg-white
                pl-9 pr-8
                text-sm font-medium
                text-slate-600
                outline-none
                hover:border-slate-300
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <FiChevronDown
              size={14}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
          </div>

          {/* Payment */}
          <div className="relative">
            <FiCreditCard
              size={15}
              className="
                pointer-events-none
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <select
              value={paymentMethod}
              onChange={handlePaymentChange}
              className="
                h-10 min-w-[140px]
                appearance-none
                rounded-lg
                border border-slate-200
                bg-white
                pl-9 pr-8
                text-sm font-medium
                text-slate-600
                outline-none
                hover:border-slate-300
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="">All Payment</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>

            <FiChevronDown
              size={14}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
          </div>

          {/* Date */}
          {/* Date From */}
          <div className="relative">
            <FiCalendar
              size={15}
              className="
      pointer-events-none
      absolute left-3 top-1/2
      -translate-y-1/2
      text-slate-500
    "
            />

            <input
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              className="
      h-10
      min-w-[155px]
      rounded-lg
      border border-slate-200
      bg-white
      pl-9 pr-3
      text-sm font-medium
      text-slate-600
      outline-none
      hover:border-slate-300
      focus:border-blue-500
      focus:ring-4
      focus:ring-blue-50
    "
              title="From date"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <FiCalendar
              size={15}
              className="
      pointer-events-none
      absolute left-3 top-1/2
      -translate-y-1/2
      text-slate-500
    "
            />

            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={handleDateToChange}
              className="
      h-10
      min-w-[155px]
      rounded-lg
      border border-slate-200
      bg-white
      pl-9 pr-3
      text-sm font-medium
      text-slate-600
      outline-none
      hover:border-slate-300
      focus:border-blue-500
      focus:ring-4
      focus:ring-blue-50
    "
              title="To date"
            />
          </div>
          {/* Clear filters */}
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={
              !search && !status && !paymentMethod && !dateFrom && !dateTo
            }
            className="
    inline-flex h-10
    items-center justify-center gap-2
    rounded-lg
    border border-slate-200
    bg-white
    px-4
    text-sm font-medium
    text-slate-600
    transition
    hover:border-slate-300
    hover:bg-slate-50
    hover:text-slate-900
    focus:outline-none
    focus:ring-4
    focus:ring-slate-100
    disabled:cursor-not-allowed
    disabled:opacity-40
    disabled:hover:border-slate-200
    disabled:hover:bg-white
    disabled:hover:text-slate-600
  "
          >
            <FiX size={15} />
            Clear filters
          </button>
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Sales
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {pagination.total} invoices found
            </p>
          </div>
        </div>

        {/* Loading */}
        {isPending && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500">Loading sales...</p>
          </div>
        )}

        {/* Error */}
        {isError && !isPending && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-red-600">
              Failed to load sales.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isPending && !isError && sales.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No sales found</p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!isPending && !isError && sales.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Invoice
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-slate-50/70">
                    {/* Invoice */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-blue-600">
                        {sale.invoice_number}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {sale.items.length}{" "}
                        {sale.items.length === 1 ? "item" : "items"}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <FiUser size={15} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {sale.customer_name || "Walk-in Customer"}
                          </p>

                          {sale.customer_phone && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {sale.customer_phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(sale.created_at)}
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span className="text-sm capitalize text-slate-600">
                        {sale.payment_method || "-"}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatRupiah(sale.total)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={sale.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* View invoice */}
                        <button
                          type="button"
                          onClick={() => navigate(`/sales/${sale.id}/invoice`)}
                          className="
        inline-flex h-8 w-8
        items-center justify-center
        rounded-lg
        text-slate-400
        transition
        hover:bg-blue-50
        hover:text-blue-600
      "
                          title="View invoice"
                        >
                          <FiEye size={16} />
                        </button>

                        {/* Cancel invoice */}
                        <button
                          type="button"
                          onClick={() => setCancelSale(sale)}
                          disabled={sale.status === "cancelled"}
                          className="
        inline-flex h-8 w-8
        items-center justify-center
        rounded-lg
        text-slate-400
        transition
        hover:bg-red-50
        hover:text-red-600
        disabled:cursor-not-allowed
        disabled:opacity-30
      "
                          title={
                            sale.status === "cancelled"
                              ? "Invoice cancelled"
                              : "Cancel invoice"
                          }
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE LIST */}
        {/* MOBILE LIST */}
        {!isPending && !isError && sales.length > 0 && (
          <div className="divide-y divide-slate-100 md:hidden">
            {sales.map((sale) => (
              <div key={sale.id} className="p-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-600">
                      {sale.invoice_number}
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-800">
                      {sale.customer_name || "Walk-in Customer"}
                    </p>

                    {sale.customer_phone && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {sale.customer_phone}
                      </p>
                    )}
                  </div>

                  <StatusBadge status={sale.status} />
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Date
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {formatDate(sale.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Payment
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-slate-600">
                      {sale.payment_method || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Items
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {sale.items.length}{" "}
                      {sale.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Total
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">
                      {formatRupiah(sale.total)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() => navigate(`/sales/${sale.id}/invoice`)}
                    className="
              inline-flex
              h-9
              flex-1
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-xs
              font-medium
              text-slate-600
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
            "
                  >
                    <FiEye size={14} />
                    View Invoice
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => setCancelSale(sale)}
                    disabled={sale.status.toLowerCase() === "cancelled"}
                    className="
              inline-flex
              h-9
              flex-1
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-xs
              font-medium
              text-slate-600
              transition
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
                  >
                    <FiTrash2 size={14} />
                    Cancel Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isPending && !isError && totalPages > 0 && (
          <Pagination
            page={pagination.page}
            total_page={totalPages}
            onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          />
        )}
      </div>

      <DeleteConfirmModal
        open={cancelSale !== null}
        title="Cancel Invoice"
        message="Are you sure you want to cancel this invoice? The stock will be returned to inventory."
        itemName={cancelSale?.invoice_number}
        isDeleting={isCancelling}
        onClose={() => {
          if (!isCancelling) {
            setCancelSale(null);
          }
        }}
        onConfirm={() => {
          if (!cancelSale) return;

          cancelInvoice(cancelSale.id, {
            onSuccess: () => {
              setCancelSale(null);
            },
          });
        }}
      />
    </div>
  );
}

/* =============================================================
   FILTER BUTTON
============================================================= */

// function FilterButton({ children }: { children: React.ReactNode }) {
//   return (
//     <button
//       type="button"
//       className="
//         inline-flex h-10
//         items-center justify-center gap-2
//         rounded-lg
//         border border-slate-200
//         bg-white
//         px-3
//         text-sm font-medium
//         text-slate-600
//         transition
//         hover:border-slate-300
//         hover:bg-slate-50
//       "
//     >
//       {children}
//     </button>
//   );
// }

/* =============================================================
   STATUS
============================================================= */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const completed = normalizedStatus === "completed";

  const cancelled =
    normalizedStatus === "cancelled" || normalizedStatus === "canceled";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        completed
          ? "bg-emerald-50 text-emerald-700"
          : cancelled
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}
