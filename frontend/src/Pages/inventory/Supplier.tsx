import {  useState } from "react";
import {
  FiEdit2,
  FiMail,
  FiPackage,
  FiPhone,
  FiPlus,
  // FiSearch,
  FiTrash2,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import { useSuppliers, useDeleteSupplier ,type SupplierData} from "../../utils/inventoryQuery";

import { SupplierModal } from "./SupplierModal";
import { DeleteConfirmModal } from "../../Components/DeleteConfirmModal";
import { SupplierTableSkeleton } from "./SupplierTableSkeleton";
import { Pagination } from "../../Components/Pagination";



export function Supplier() {
  // const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(
    null,
  );

  const [supplierToDelete, setSupplierToDelete] = useState<SupplierData | null>(
    null,
  );
  const [page,setPage]=useState(1);
  const { suppliers,pagination, isPending: isLoading } = useSuppliers(page);
  const totalPages = pagination?.pages ?? 0;

  const { deleteSupplier, isPending: isDeleting } = useDeleteSupplier();

  // const filteredSuppliers = useMemo(() => {
  //   const query = search.toLowerCase().trim();

  //   if (!query) {
  //     return suppliers;
  //   }

  //   return suppliers.filter((supplier) =>
  //     [supplier.name, supplier.contact_person, supplier.phone, supplier.email]
  //       .filter(Boolean)
  //       .some((value) => value!.toLowerCase().includes(query)),
  //   );
  // }, [suppliers, search]);

  const openCreate = () => {
    setSelectedSupplier(null);
    setShowModal(true);
  };

  const openEdit = (supplier: SupplierData) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!supplierToDelete) {
      return;
    }

    deleteSupplier(supplierToDelete.id, {
      onSuccess: () => {
        setSupplierToDelete(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-900 p-2">
                <FiTruck size={20} className="text-white" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Manage your inventory suppliers and contact information.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <FiPlus size={17} />
            Add Supplier
          </button>
        </div>

        {/* Search */}
        {/* <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-lg">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div> */}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">All Suppliers</h2>

              <p className="mt-1 text-xs text-slate-500">
                {suppliers.length} suppliers
              </p>
            </div>
          </div>

          {isLoading ? (
            <SupplierTableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Supplier
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    {/* <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th> */}

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Products
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {suppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Supplier */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <FiTruck size={17} className="text-slate-600" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {supplier.name}
                            </p>

                            {/* {supplier.product_count !== undefined && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {supplier.product_count} products
                              </p>
                            )} */}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
<td className="px-6 py-4">
  <div className="space-y-1 text-sm text-slate-600">
    {supplier.contact_person && (
      <div className="flex items-center gap-2">
        <FiUser size={14} className="text-slate-400" />
        {supplier.contact_person}
      </div>
    )}

    {supplier.phone && (
      <div className="flex items-center gap-2">
        <FiPhone size={14} className="text-slate-400" />
        {supplier.phone}
      </div>
    )}

    {supplier.email && (
      <div className="flex items-center gap-2">
        <FiMail size={14} className="text-slate-400" />
        {supplier.email}
      </div>
    )}

    {!supplier.contact_person && !supplier.phone && !supplier.email && (
      <span className="text-slate-400">—</span>
    )}
  </div>
</td>
                      <td className="px-6 py-4">
                        {supplier.product_count ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <FiPackage size={13} />

                            {supplier.product_count}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="Edit supplier"
                            onClick={() => openEdit(supplier)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            type="button"
                            title="Delete supplier"
                            onClick={() => setSupplierToDelete(supplier)}
                            disabled={isDeleting}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <FiTruck size={30} className="mx-auto text-slate-300" />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          No suppliers found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try a different search term or add a new supplier.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Showing {suppliers.length} suppliers
            </p>
          </div>
        </div>
          {totalPages > 1 && (
            <Pagination
              page={pagination?.page ?? 1}
              total_page={totalPages}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
            />
          )}
      </div>

      {/* Create / Edit */}
      {showModal && (
        <SupplierModal
          supplier={selectedSupplier}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete confirmation */}
      <DeleteConfirmModal
        open={Boolean(supplierToDelete)}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
        itemName={supplierToDelete?.name}
        isDeleting={isDeleting}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
