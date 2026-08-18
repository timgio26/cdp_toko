import { useState } from "react";
import {useCreateStockMovement,useUpdateStockMovement,type StockMovement} from "../../utils/inventoryQuery";
import { ProductSearchSelect } from "../../Components/ProductSearchSelect";

type StockMovementModalProps = {
  movement: StockMovement | null;
  onClose: () => void;
};

export function StockMovementModal({movement,onClose,}: StockMovementModalProps) {
  const isEditing = Boolean(movement);
  const [productId, setProductId] = useState(movement?.product_id ?? "");
  const [quantity, setQuantity] = useState(
    movement ? String(Math.abs(movement.quantity_change)) : "",
  );
  const [movementType, setMovementType] = useState<"inbound" | "outbound">(
    movement?.quantity_change && movement.quantity_change < 0
      ? "outbound"
      : "inbound",
  );
  const [reason, setReason] = useState(movement?.reason ?? "");
  const [error, setError] = useState("");
  const [createdAt, setCreatedAt] = useState(
    movement?.created_at
      ? new Date(movement.created_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const { createStockMovement, isPending } = useCreateStockMovement();
  const { updateStockMovement, isPending: isUpdating } =
    useUpdateStockMovement();

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

    if (isEditing && movement) {
      updateStockMovement(
        {
          id: movement.id,
          data: {
            quantity_change: quantityChange,
            reason: reason.trim(),
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );

      return;
    }

    createStockMovement(
      {
        product_id: productId,
        quantity_change: quantityChange,
        reason: reason.trim(),
        created_at: createdAt,
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
              {isEditing ? "Edit Stock Movement" : "Add Stock Movement"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update stock movement information."
                : "Adjust product stock and record the reason."}
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
            <div>
              <ProductSearchSelect
                value={productId}
                onChange={(id) => {
                  setProductId(id);
                  setError("");
                }}
                disabled={isPending || isEditing}
              />
            </div>
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

          <div className="mt-4">
            <label
              htmlFor="stock-date"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Date
            </label>

            <input
              id="stock-date"
              type="datetime-local"
              value={createdAt}
              onChange={(e) => {
                setCreatedAt(e.target.value);
                setError("");
              }}
              disabled={isPending || isEditing}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />
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

              {isPending || isUpdating
                ? "Saving..."
                : isEditing
                  ? "Save"
                  : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
