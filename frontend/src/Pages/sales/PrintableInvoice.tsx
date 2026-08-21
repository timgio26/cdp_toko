import { FiPrinter, FiArrowLeft } from "react-icons/fi";
import { type Sale } from "../../utils/SalesQuery";
import { useNavigate } from "react-router";
import { formatDate, formatRupiah } from "../../utils/myfunction";



interface PrintableInvoiceProps {
  sale: Sale;
}


const formatPaymentMethod = (value?: string) => {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function PrintableInvoice({sale,}: PrintableInvoiceProps) {
  const navigate = useNavigate();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      {/* Actions - hidden when printing */}
      <div className="mx-auto mb-5 flex max-w-4xl justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="
            inline-flex items-center gap-2
            rounded-lg border border-slate-200
            bg-white px-4 py-2.5
            text-sm font-semibold text-slate-700
            hover:bg-slate-50
          "
        >
          <FiArrowLeft />
          Back
        </button>

<button
  type="button"
  onClick={handlePrint}
  className="
    no-print
    inline-flex items-center gap-2
    rounded-lg bg-blue-600
    px-4 py-2.5
    text-sm font-semibold text-white
    hover:bg-blue-700
  "
>
  <FiPrinter />
  Print Invoice
</button>
      </div>

      {/* Invoice */}
      <main
        className="
          mx-auto max-w-4xl
          bg-white
          p-6 shadow-sm
          md:p-10
          print:max-w-none
          print:shadow-none
        "
      >
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* Replace with your company information */}
<h1 className="text-2xl font-bold text-slate-900">
  Setia Purindo
</h1>

<div className="mt-2 text-sm leading-6 text-slate-500">
  {/* <p>Home Water Filtration &amp; Purification Services</p> */}
  <p>Jl. Holis Regency No. C-38</p>
  <p>Babakan, Kec. Babakan Ciparay</p>
  <p>Kota Bandung, Jawa Barat</p>
  <p>setiapurindo@yahoo.com</p>
  <p>WhatsApp: 085 100 988 355</p>
</div>
          </div>

          <div className="sm:text-right">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Invoice
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {sale.invoice_number}
            </h2>

            <div className="mt-3 space-y-1 text-sm text-slate-500">
              <p>
                Date:{" "}
                <span className="font-medium text-slate-700">
                  {formatDate(sale.created_at)}
                </span>
              </p>

              <p>
                Payment:{" "}
                <span className="font-medium text-slate-700">
                  {formatPaymentMethod(sale.payment_method)}
                </span>
              </p>

              <p>
                Status:{" "}
                <span className="font-medium uppercase text-slate-700">
                  {sale.status}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Customer */}
        <section className="py-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bill To
          </p>

          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {sale.customer_name || "Walk-in Customer"}
          </h3>

          <div className="mt-1 text-sm leading-6 text-slate-500">
            {sale.customer_phone && (
              <p>{sale.customer_phone}</p>
            )}

            {sale.customer_email && (
              <p>{sale.customer_email}</p>
            )}
          </div>
        </section>

        {/* Items */}
        <section>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Discount
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sale.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.product_sku}

                      </p>
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-600">
                      {formatRupiah(item.unit_price)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-600">
                      {item.quantity} {item.product_unit??""}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-600">
                      {Number(item.discount_amount) > 0
                        ? `-${formatRupiah(item.discount_amount)}`
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <section className="mt-8 flex justify-end">
          <div className="w-full max-w-sm space-y-3">
            <SummaryRow
              label="Subtotal"
              value={sale.subtotal}
            />

            <SummaryRow
              label="Item Discount"
              value={sale.item_discount}
              negative
            />

            <SummaryRow
              label="Order Discount"
              value={sale.order_discount}
              negative
            />

            {Number(sale.tax_amount) > 0 && (
              <SummaryRow
                label="Tax"
                value={sale.tax_amount}
              />
            )}

            {Number(sale.shipping_fee) > 0 && (
              <SummaryRow
                label="Shipping Fee"
                value={sale.shipping_fee}
              />
            )}

            {Number(sale.service_fee) > 0 && (
              <SummaryRow
                label="Service Fee"
                value={sale.service_fee}
              />
            )}

            <div className="border-t-2 border-slate-900 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  {formatRupiah(sale.total)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm font-medium text-slate-600">
            Thank you for your purchase!
          </p>

          <p className="mt-1 text-xs text-slate-400">
            This invoice was generated electronically.
          </p>
        </footer>
      </main>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  const formatRupiah = (amount: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (Number(value) === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium text-slate-700">
        {negative && "-"}
        {formatRupiah(value)}
      </span>
    </div>
  );
}