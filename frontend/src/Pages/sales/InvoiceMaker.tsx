import { useMemo, useState } from "react";
import {
  FiTrash2,
  FiUser,
  FiShoppingCart,
  FiFileText,
  FiCreditCard,
  FiTag,
} from "react-icons/fi";
import { CiCircleChevLeft } from "react-icons/ci";
import { ProductSearchSelect } from "../../Components/ProductSearchSelect";
import type { ProductData } from "../../utils/inventoryQuery";
import { CustomerSearchSelect } from "../../Components/CustomerSearchSelect";
import type { ICustomer } from "../../utils/customerQuery";
import { useCreateSale, type CreateSalePayload } from "../../utils/SalesQuery";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { formatRupiah } from "../../utils/myfunction";

type InvoiceItem = ProductData & {
  quantity: number;
  discount: number;
};


export default function InvoiceMaker() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<ICustomer>();
  const [customerManual, setCustomerManual] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const { createInvoice, isPending } = useCreateSale();

  const [orderDiscount, setOrderDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.selling_price_per_unit * item.quantity,
      0,
    );
  }, [items]);

  const itemDiscount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.discount, 0);
  }, [items]);

  const total = useMemo(() => {
    return subtotal - itemDiscount - orderDiscount + shippingFee + serviceFee;
  }, [subtotal, itemDiscount, orderDiscount, shippingFee, serviceFee]);

  function addProduct(product: ProductData) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
          discount: 0,
        },
      ];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 0) return;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  function updateDiscount(id: string, discount: number) {
    if (discount < 0) return;

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, discount } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleSubmit() {
    
    if (items.length === 0) {
      toast("Please add at least one product", {
        type: "error",
      });
      return;
    }

    const normalizeName = (name:string) =>
      (name ?? "").trim().toLowerCase();

    const customerId =
      customer?.id &&
      normalizeName(customer?.name) === normalizeName(customerManual.name)
        ? customer.id
        : null;


    const payload: CreateSalePayload = {
      // invoice_number: `INV-${Date.now()}`,

      customer_id: customerId,
      customer_name: customerManual.name || null,
      customer_phone: customerManual.phone || null,
      customer_email: customerManual.email || null,

      order_discount: orderDiscount,
      shipping_fee: shippingFee,
      service_fee: serviceFee,

      // If your backend calculates tax, you can omit this.
      tax_amount: 0,

      payment_method: paymentMethod,

      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.selling_price_per_unit,
        discount_amount: item.discount,
      })),
    };

    createInvoice(payload);
  }



  return (
    <div className="space-y-5 pb-6">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={()=> navigate("/sales")}
            className="group shrink-0"
            aria-label="Go back"
          >
            <CiCircleChevLeft
              size={29}
              className="
                text-slate-300
                transition
                group-hover:text-blue-600
              "
            />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create Invoice
              </h1>

              <span
                className="
                rounded-full
                bg-blue-50
                px-2.5 py-1
                text-[11px] font-semibold
                text-blue-700
              "
              >
                New Sale
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Create a new sales invoice and record payment.
            </p>
          </div>
        </div>

        {/* <button
          type="button"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4 py-2.5
            text-sm font-semibold
            text-white
            transition
            hover:bg-blue-700
            focus:outline-none
            focus:ring-4
            focus:ring-blue-100
          "
        >
          <FiFileText size={16} />
          Save Invoice
        </button> */}
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* =================================================
            LEFT
        ================================================== */}
        <div className="space-y-5">
          {/* Customer */}
          <section className="rounded-xl border border-slate-200 bg-white">
            <SectionHeader
              icon={<FiUser size={18} />}
              title="Customer"
              description="Customer information snapshot"
              iconClass="bg-blue-50 text-blue-600"
              action={
                <CustomerSearchSelect
                  value=""
                  onChange={(customer) => {
                    setCustomer(customer);
                    setCustomerManual({
                      ...customerManual,
                      name: customer.name,
                      phone: customer.phone ?? "",
                      email: customer.email ?? "",
                    });
                  }}
                />
              }
            />

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
              <TextField
                label="Customer Name"
                value={customerManual.name}
                placeholder="Walk-in Customer"
                onChange={(value) =>
                  setCustomerManual({
                    ...customerManual,
                    name: value,
                  })
                }
              />

              <TextField
                label="Phone"
                value={customerManual.phone}
                placeholder="08xxxxxxxxxx"
                onChange={(value) =>
                  setCustomerManual({
                    ...customerManual,
                    phone: value,
                  })
                }
              />

              <TextField
                label="Email"
                value={customerManual.email}
                placeholder="customer@email.com"
                onChange={(value) =>
                  setCustomerManual({
                    ...customerManual,
                    email: value,
                  })
                }
              />
            </div>
          </section>

          {/* Products */}
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Products
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Search and add products to this invoice.
                  </p>
                </div>

                {items.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>

              <ProductSearchSelect value="" onChange={addProduct} />
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                <div
                  className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-slate-100
                  text-slate-400
                "
                >
                  <FiShoppingCart size={21} />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No products added
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Add a product to start creating the invoice.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Price
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Discount
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </th>

                      <th className="w-10 px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const gross = item.selling_price_per_unit * item.quantity;

                      const itemTotal = gross - item.discount;

                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-slate-50/60"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.sku} 
                            </p>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatRupiah(item.selling_price_per_unit)}
                          </td>

                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={item.quantity === 0 ? "" : item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number(e.target.value))
                              }
                              className="
                                h-9 w-16
                                rounded-lg
                                border border-slate-200
                                bg-white
                                px-2
                                text-center
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-50
                              "
                            />
                            {item.unit}
                          </td>

                          <td className="px-4 py-4">
                            <div className="relative w-28">
                              <span
                                className="
                                pointer-events-none
                                absolute left-2.5 top-1/2
                                -translate-y-1/2
                                text-[11px]
                                font-medium
                                text-slate-400
                              "
                              >
                                Rp
                              </span>

                              <input
                                type="number"
                                min={0}
                                value={item.discount === 0 ? "" : item.discount}
                                onChange={(e) =>
                                  updateDiscount(
                                    item.id,
                                    Number(e.target.value),
                                  )
                                }
                                className="
                                  h-9 w-full
                                  rounded-lg
                                  border border-slate-200
                                  bg-white
                                  pl-8 pr-2
                                  text-sm
                                  outline-none
                                  transition
                                  focus:border-blue-500
                                  focus:ring-2
                                  focus:ring-blue-50
                                "
                              />
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-bold text-slate-800">
                              {formatRupiah(itemTotal)}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="
                                rounded-lg
                                p-2
                                text-slate-300
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                              "
                              aria-label={`Remove ${item.name}`}
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================== */}
        <div className="space-y-5">
          {/* Invoice Details */}
          <section className="rounded-xl border border-slate-200 bg-white">
            <SectionHeader
              icon={<FiFileText size={18} />}
              title="Invoice Details"
              description="Sale information"
              iconClass="bg-slate-100 text-slate-600"
            />

            <div className="space-y-4 p-5">
              {/* <div>
                <label className="text-xs font-semibold text-slate-600">
                  Invoice Number
                </label>

                <div
                  className="
                  mt-1.5
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  px-3.5 py-2.5
                  text-sm font-semibold
                  text-slate-700
                "
                >
                  INV-20260818-001
                </div>
              </div> */}

              <div>
                <label
                  htmlFor="invoice-date"
                  className="text-xs font-semibold text-slate-600"
                >
                  Date
                </label>

                <input
                  id="invoice-date"
                  type="date"
                  defaultValue="2026-08-18"
                  className="
                    mt-1.5
                    h-10 w-full
                    rounded-lg
                    border border-slate-200
                    bg-white
                    px-3.5
                    text-sm text-slate-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />
              </div>
            </div>
          </section>

          {/* Discounts / Fees */}
          <section className="rounded-xl border border-slate-200 bg-white">
            <SectionHeader
              icon={<FiTag size={18} />}
              title="Discounts & Fees"
              description="Adjust the final amount"
              iconClass="bg-amber-50 text-amber-600"
            />

            <div className="space-y-4 p-5">
              <MoneyInput
                label="Order Discount"
                value={orderDiscount}
                onChange={setOrderDiscount}
              />

              <MoneyInput
                label="Shipping Fee"
                value={shippingFee}
                onChange={setShippingFee}
              />

              <MoneyInput
                label="Service Fee"
                value={serviceFee}
                onChange={setServiceFee}
              />
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-slate-200 bg-white">
            <SectionHeader
              icon={<FiCreditCard size={18} />}
              title="Payment"
              description="Select payment method"
              iconClass="bg-blue-50 text-blue-600"
            />

            <div className="p-5">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["cash", "Cash"],
                  ["transfer", "Transfer"],
                  ["qris", "QRIS"],
                  ["card", "Card"],
                ].map(([value, label]) => {
                  const selected = paymentMethod === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPaymentMethod(value)}
                      className={`
                        rounded-lg
                        border
                        px-3 py-2.5
                        text-sm font-semibold
                        transition
                        ${
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================
              TOTAL
          ================================================== */}
          <section
            className="
            overflow-hidden
            rounded-xl
            border border-blue-200
            bg-white
          "
          >
            <div className="bg-blue-600 px-5 py-4">
              <p
                className="
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-blue-100
              "
              >
                Total Amount
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {formatRupiah(total)}
              </p>
            </div>

            <div className="space-y-3 p-5">
              <SummaryRow label="Subtotal" value={subtotal} />

              <SummaryRow
                label="Item Discount"
                value={-itemDiscount}
                negative
              />

              <SummaryRow
                label="Order Discount"
                value={-orderDiscount}
                negative
              />

              <SummaryRow label="Shipping" value={shippingFee} />

              <SummaryRow label="Service Fee" value={serviceFee} />

              <div className="border-t border-dashed border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Total
                  </span>

                  <span className="text-lg font-bold text-blue-600">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

<button
  type="button"
  disabled={isPending}
  className="
    mt-2
    flex w-full
    items-center
    justify-center
    rounded-lg
    bg-blue-600
    px-4 py-2.5
    text-sm font-bold
    text-white
    transition
    hover:bg-blue-700
    focus:outline-none
    focus:ring-4
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
  onClick={handleSubmit}
>
  {isPending ? "Completing Sale..." : "Complete Sale"}
</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
  iconClass,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="
      flex flex-col gap-3
      border-b border-slate-100
      px-5 py-4
      sm:flex-row sm:items-center sm:justify-between
    "
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-lg
          ${iconClass}
        `}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   TEXT FIELD
========================================================= */

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-10 w-full
          rounded-lg
          border border-slate-200
          bg-white
          px-3.5
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
  );
}

/* =========================================================
   MONEY INPUT
========================================================= */

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div className="relative">
        <span
          className="
          pointer-events-none
          absolute left-3.5 top-1/2
          -translate-y-1/2
          text-xs font-medium
          text-slate-400
        "
        >
          Rp
        </span>

        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            h-10 w-full
            rounded-lg
            border border-slate-200
            bg-white
            py-2.5 pl-10 pr-3
            text-sm text-slate-800
            outline-none
            transition
            hover:border-slate-300
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-50
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>

      <span
        className={
          negative ? "font-medium text-amber-600" : "font-medium text-slate-700"
        }
      >
        {formatRupiah(value)}
      </span>
    </div>
  );
}
