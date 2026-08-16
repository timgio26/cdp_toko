import { useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import {
  type StockMovement,
  useDeleteStockMovement,
  useStockMovements,
} from "../../utils/inventoryQuery";

import { StockMovementModal } from "./StockMovementModal";
import { DeleteConfirmModal } from "../../Components/DeleteConfirmModal";

export function StockMovement() {
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedMovement, setSelectedMovement] =
    useState<StockMovement | null>(null);

  const [movementToDelete, setMovementToDelete] =
    useState<StockMovement | null>(null);

  const { stockMovements: movements } = useStockMovements();

  const { deleteStockMovement, isPending: isDeleting } =
    useDeleteStockMovement();

  // =========================================================
  // FILTER MOVEMENTS
  // =========================================================

  const filteredMovements = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return movements;
    }

    return movements.filter((movement) => {
      return (
        movement.product_name?.toLowerCase().includes(query) ||
        movement.product_sku?.toLowerCase().includes(query) ||
        movement.reason?.toLowerCase().includes(query)
      );
    });
  }, [search, movements]);

  // =========================================================
  // CREATE
  // =========================================================

  const openCreate = () => {
    setSelectedMovement(null);
    setShowModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setShowModal(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = () => {
    if (!movementToDelete) {
      return;
    }

    deleteStockMovement(movementToDelete.id, {
      onSuccess: () => {
        setMovementToDelete(null);
      },
    });
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // =========================================================
  // RENDER
  // =========================================================

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

              <h1 className="text-2xl font-bold text-slate-900">
                Stock Movements
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Track inventory changes and manage stock movements.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <FiPlus size={17} />
            Add Movement
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SKU, or reason..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* =====================================================
        TABLE
    ====================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Inventory History</h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredMovements.length} movements
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Before
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Change
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    After
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reason
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMovements.map((movement) => {
                  const isIncoming = movement.quantity_change > 0;

                  return (
                    <tr
                      key={movement.id}
                      className="transition hover:bg-slate-50"
                    >
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
                              {movement.product_name}
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-slate-400">
                              {movement.product_sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* =================================================
                      QUANTITY BEFORE
                  ================================================== */}

                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-sm font-medium text-slate-600">
                          {movement.quantity_before}
                        </span>
                      </td>

                      {/* =================================================
                      QUANTITY CHANGE
                  ================================================== */}

                      <td className="px-6 py-4 text-center">
                        {isIncoming ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <FiArrowUp size={13} />+{movement.quantity_change}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <FiArrowDown size={13} />
                            {movement.quantity_change}
                          </span>
                        )}
                      </td>

                      {/* =================================================
                      QUANTITY AFTER
                  ================================================== */}

                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-sm font-semibold text-slate-900">
                          {movement.quantity_after}
                        </span>
                      </td>

                      {/* =================================================
                      REASON
                  ================================================== */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {movement.reason}
                        </span>
                      </td>

                      {/* =================================================
                      DATE
                  ================================================== */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {formatDate(movement.created_at)}
                        </span>
                      </td>

                      {/* =================================================
                      ACTIONS
                  ================================================== */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          {movement.can_edit && (
                            <button
                              type="button"
                              onClick={() => openEdit(movement)}
                              title="Edit movement"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <FiEdit2 size={16} />
                            </button>
                          )}

                          {movement.can_delete && (
                            <button
                              type="button"
                              title="Delete movement"
                              onClick={() => setMovementToDelete(movement)}
                              disabled={isDeleting}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* =====================================================
                EMPTY STATE
            ====================================================== */}

                {filteredMovements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FiPackage size={28} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No stock movements found
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

          {/* =====================================================
          FOOTER
      ====================================================== */}

          <div className="border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Showing {filteredMovements.length} movements
            </p>
          </div>
        </div>
      </div>

      {/* ===========================================================
      MOVEMENT MODAL
  ============================================================ */}

      {showModal && <StockMovementModal onClose={() => setShowModal(false)} />}

      {/* ===========================================================
      DELETE CONFIRMATION
  ============================================================ */}

      <DeleteConfirmModal
        open={Boolean(movementToDelete)}
        title="Delete Stock Movement"
        message="Deleting a stock movement will affect the inventory history. Make sure this movement should be removed before continuing."
        itemName={movementToDelete?.product_name}
        isDeleting={isDeleting}
        onClose={() => setMovementToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
