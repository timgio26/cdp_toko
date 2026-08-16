import { useState } from "react";
import {
  useCreateStockMovement,
  useProducts,
} from "../../utils/inventoryQuery";

type StockMovementModalProps = {
  //   products: ProductOption[];
  onClose: () => void;
};

export function StockMovementModal({ onClose }: StockMovementModalProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [movementType, setMovementType] = useState<"inbound" | "outbound">(
    "inbound",
  );
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const { createStockMovement, isPending } = useCreateStockMovement();
  const { products } = useProducts(); //need to fix

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!productId) {
      setError("Product is required.");
      return;
    }

    if (!quantity.trim()) {
      setError("Quantity is required.");
      return;
    }

    const amount = Number(quantity);

    if (!Number.isInteger(amount)) {
      setError("Quantity must be a whole number.");
      return;
    }

    if (amount <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }

    if (reason.trim().length > 255) {
      setError("Reason must be 255 characters or less.");
      return;
    }

    const quantityChange = movementType === "inbound" ? amount : -amount;

    createStockMovement(
      {
        product_id: productId,
        quantity_change: quantityChange,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Stock Movement
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Adjust product stock and record the reason.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-xl text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product */}
          <div>
            <label
              htmlFor="stock-product"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Product
            </label>

            <select
              id="stock-product"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setError("");
              }}
              disabled={isPending}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            >
              <option value="">Select a product...</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Movement Type */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Movement Type
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMovementType("inbound");
                  setError("");
                }}
                disabled={isPending}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  movementType === "inbound"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="font-medium">Inbound</div>

                <div
                  className={`mt-0.5 text-xs ${
                    movementType === "inbound"
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  Add stock
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMovementType("outbound");
                  setError("");
                }}
                disabled={isPending}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  movementType === "outbound"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="font-medium">Outbound</div>

                <div
                  className={`mt-0.5 text-xs ${
                    movementType === "outbound"
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  Remove stock
                </div>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4">
            <label
              htmlFor="stock-quantity"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Quantity
            </label>

            <input
              id="stock-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError("");
              }}
              placeholder="e.g. 10"
              disabled={isPending}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />

            <p className="mt-1.5 text-xs text-slate-400">
              {movementType === "inbound"
                ? "Quantity will be added to stock."
                : "Quantity will be removed from stock."}
            </p>
          </div>

          {/* Reason */}
          <div className="mt-4">
            <label
              htmlFor="stock-reason"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Reason
            </label>

            <textarea
              id="stock-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="e.g. New shipment received"
              disabled={isPending}
              maxLength={255}
              rows={3}
              className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-xs text-slate-400">
                {reason.length}/255
              </span>
            </div>
          </div>

          {/* Validation error */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isPending ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
