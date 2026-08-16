import { useState } from "react";

import type { ProductData } from "../../utils/inventoryQuery";

import {
  useCategories,
  useCreateProduct,
  useSuppliers,
  useUpdateProduct,
} from "../../utils/inventoryQuery";

type ProductModalProps = {
  product: ProductData | null;
  onClose: () => void;
};

export function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  const isEditing = Boolean(product);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
//   const [quantity, setQuantity] = useState(
//     product?.quantity?.toString() ?? "",
//   );
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [pricePerUnit, setPricePerUnit] = useState(
    product?.price_per_unit?.toString() ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? "",
  );

  const [supplierIds, setSupplierIds] = useState<string[]>(
    product?.suppliers.map((supplier) => supplier.id) ?? [],
  );

  const [error, setError] = useState("");

  // =========================================================
  // DATA
  // =========================================================

  const { categories = [] } = useCategories();

  const { suppliers = [] } = useSuppliers();

  // =========================================================
  // MUTATIONS
  // =========================================================

  const { createProduct, isPending: isCreating } =
    useCreateProduct();

  const { updateProduct, isPending: isUpdating } =
    useUpdateProduct();

  const isPending = isCreating || isUpdating;

  // =========================================================
  // SUPPLIER SELECTION
  // =========================================================

  const toggleSupplier = (supplierId: string) => {
    setSupplierIds((current) => {
      if (current.includes(supplierId)) {
        return current.filter((id) => id !== supplierId);
      }

      return [...current, supplierId];
    });

    setError("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSku = sku.trim();
    const trimmedUnit = unit.trim();

    // ---------------------------------------------------------
    // Validation
    // ---------------------------------------------------------

    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }

    if (trimmedName.length > 120) {
      setError(
        "Product name must be 120 characters or less.",
      );
      return;
    }

    if (!trimmedSku) {
      setError("SKU is required.");
      return;
    }

    if (trimmedSku.length > 60) {
      setError("SKU must be 60 characters or less.");
      return;
    }

    if (!trimmedUnit) {
      setError("Unit is required.");
      return;
    }


    const parsedPrice = Number(pricePerUnit);

    if (
      !pricePerUnit ||
      Number.isNaN(parsedPrice)
    ) {
      setError("Price per unit is required.");
      return;
    }

    if (parsedPrice < 0) {
      setError("Price per unit cannot be negative.");
      return;
    }

    if (!categoryId) {
      setError("Category is required.");
      return;
    }

    setError("");

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------

    if (isEditing && product) {
      updateProduct(
        {
          id: product.id,
          data: {
            name: trimmedName,
            sku: trimmedSku,
            // quantity: parsedQuantity,
            unit: trimmedUnit,
            price_per_unit: parsedPrice,
            category_id: categoryId,
            supplier_ids: supplierIds,
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

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------

    createProduct(
      {
        name: trimmedName,
        sku: trimmedSku,
        unit: trimmedUnit,
        price_per_unit: parsedPrice,
        category_id: categoryId,
        supplier_ids: supplierIds,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update the product information."
                : "Create a new product for your inventory."}
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

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* =================================================
                PRODUCT NAME + SKU
            ================================================== */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Product Name */}

              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Product Name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Wireless Keyboard"
                  autoFocus
                  disabled={isPending}
                  maxLength={120}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    error && !name.trim()
                      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                      : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                  }`}
                />
              </div>

              {/* SKU */}

              <div>
                <label
                  htmlFor="product-sku"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  SKU
                </label>

                <input
                  id="product-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. KB-001"
                  disabled={isPending}
                  maxLength={60}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* =================================================
                CATEGORY
            ================================================== */}

            <div>
              <label
                htmlFor="product-category"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="product-category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setError("");
                }}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* =================================================
                QUANTITY + UNIT
            ================================================== */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Quantity */}






              {/* Unit */}

              <div>
                <label
                  htmlFor="product-unit"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Unit
                </label>

                <input
                  id="product-unit"
                  type="text"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. pieces, kg, box"
                  disabled={isPending}
                  maxLength={30}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* =================================================
                PRICE
            ================================================== */}

            <div>
              <label
                htmlFor="product-price"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Price Per Unit
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => {
                  setPricePerUnit(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 25.00"
                disabled={isPending}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {/* =================================================
                SUPPLIERS
            ================================================== */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Suppliers
              </label>

              <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200">
                {suppliers.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    No suppliers available.
                  </div>
                ) : (
                  suppliers.map((supplier) => {
                    const selected = supplierIds.includes(
                      supplier.id,
                    );

                    return (
                      <label
                        key={supplier.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            toggleSupplier(supplier.id)
                          }
                          disabled={isPending}
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />

                        <span className="text-sm text-slate-700">
                          {supplier.name}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                {supplierIds.length} supplier
                {supplierIds.length === 1 ? "" : "s"} selected
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                <p className="text-xs text-red-600">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

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
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isEditing
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
