import { useState } from "react";
import {
  FiEdit2,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import {
  type ProductData,
  useDeleteProduct,
  useProducts,
} from "../../utils/inventoryQuery";

import { ProductModal } from "./ProductModal";
import { DeleteConfirmModal } from "../../Components/DeleteConfirmModal";
import { Pagination } from "../../Components/Pagination";
import { useDebounce } from "../../utils/utilsHook";

export function Product() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductData | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { products, pagination } = useProducts(page, 10, debouncedSearch);
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();
  
  const totalPages = pagination?.pages ?? 0;


  // =========================================================
  // CREATE
  // =========================================================

  const openCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (product: ProductData) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = () => {
    if (!productToDelete) {
      return;
    }

    deleteProduct(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-900 p-2">
                <FiPackage className="h-5 w-5 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Manage your products, stock, pricing, and suppliers.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <FiPlus size={17} />
            Add Product
          </button>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {setSearch(e.target.value);setPage(1);}}
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* =====================================================
            PRODUCT TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}

          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">All Products</h2>

            <p className="mt-1 text-xs text-slate-500">
              {pagination?.total} products
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  {/* Product */}

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  {/* SKU */}

                  {/* <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    SKU
                  </th> */}

                  {/* Category */}

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  {/* Quantity */}

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Quantity
                  </th>

                  {/* Price */}

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price / Unit
                  </th>

                  {/* Suppliers */}

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Suppliers
                  </th>

                  {/* Actions */}

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50">
                    {/* =================================================
                        PRODUCT
                    ================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <FiPackage size={17} className="text-slate-600" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =================================================
                        SKU
                    ================================================== */}

                    {/* <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {product.sku}
                      </span>
                    </td> */}

                    {/* =================================================
                        CATEGORY
                    ================================================== */}

                    <td className="px-6 py-4">
                      {product.category_name ? (
                        <div className="flex items-center gap-2">
                          <FiTag size={14} className="text-slate-400" />

                          <span className="text-sm text-slate-600">
                            {product.category_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No category
                        </span>
                      )}
                    </td>

                    {/* =================================================
                        QUANTITY
                    ================================================== */}

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {product.quantity} {product.unit}
                      </span>
                    </td>

                    {/* =================================================
                        PRICE
                    ================================================== */}

                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-900">
                        {Number(product.price_per_unit).toFixed(2)}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        / {product.unit}
                      </span>
                    </td>

                    {/* =================================================
                        SUPPLIERS
                    ================================================== */}

                    <td className="px-6 py-4">
                      {product.suppliers.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <FiUsers
                            size={14}
                            className="shrink-0 text-slate-400"
                          />

                          <div className="flex flex-wrap gap-1">
                            {product.suppliers.slice(0, 2).map((supplier) => (
                              <span
                                key={supplier.id}
                                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                              >
                                {supplier.name}
                              </span>
                            ))}

                            {product.suppliers.length > 2 && (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                                +{product.suppliers.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No suppliers
                        </span>
                      )}
                    </td>

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          title="Edit product"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete product"
                          onClick={() => setProductToDelete(product)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* =====================================================
                    EMPTY STATE
                ====================================================== */}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FiPackage size={28} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try a different search term.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================================
              FOOTER
          ========================================================== */}

          <div className="border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Showing {products.length} products
            </p>
          </div>
        </div>
        <Pagination
          page={pagination?.page ?? 1}
          total_page={totalPages}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        />
      </div>

      {/* ===========================================================
          PRODUCT MODAL
      ============================================================ */}

      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ===========================================================
          DELETE CONFIRMATION
      ============================================================ */}

      <DeleteConfirmModal
        open={Boolean(productToDelete)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        itemName={productToDelete?.name}
        isDeleting={isDeleting}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
