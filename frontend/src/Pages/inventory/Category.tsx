import { useState } from "react";
import { FiEdit2, FiPackage, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import { CategoryModal } from "./CategoryModal";
import { useCategories, useDeleteCategory } from "../../utils/inventoryQuery";
import { DeleteConfirmModal } from "../../Components/DeleteConfirmModal";
import { Pagination } from "../../Components/Pagination";

export type CategoryData = {
  id: string;
  name: string;
  // product_count: number;
};

export function Category() {
  // const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const { categories, pagination } = useCategories(page); //can add error and loading
  const { deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const totalPages = pagination?.pages ?? 0;

  // const filteredCategories = useMemo(() => {
  //   const query = search.toLowerCase().trim();

  //   if (!query) {
  //     return categories;
  //   }

  //   return categories.filter((category) =>
  //     category.name.toLowerCase().includes(query),
  //   );
  // }, [search, categories]);

  const openCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const openEdit = (category: CategoryData) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!categoryToDelete) {
      return;
    }

    deleteCategory(categoryToDelete.id, {
      onSuccess: () => {
        setCategoryToDelete(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-900 p-2">
                <FiTag className="h-5 w-5 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Organize your products into categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <FiPlus size={17} />
            Add Category
          </button>
        </div>

        {/* Search */}
        {/* <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div> */}

        {/* Category table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">All Categories</h2>

            <p className="mt-1 text-xs text-slate-500">
              {pagination?.total} categories
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Products
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                          <FiTag size={17} className="text-slate-600" />
                        </div>

                        <span className="text-sm font-medium text-slate-900">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    {/* Products */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <FiPackage size={13} />
                        {category.product_count ? category.product_count : 0}
                        {/* todo */}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          title="Edit category"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete category"
                          onClick={() => setCategoryToDelete(category)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <FiTag size={28} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No categories found
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

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Showing {categories.length} categories
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

      {/* Modal */}
      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
        />
      )}

      <DeleteConfirmModal
        open={Boolean(categoryToDelete)}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        itemName={categoryToDelete?.name}
        isDeleting={isDeleting}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
