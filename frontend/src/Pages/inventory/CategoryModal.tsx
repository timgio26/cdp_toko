import { useState } from "react";
import type { CategoryData } from "./Category";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../../utils/inventoryQuery";

type CategoryModalProps = {
  category: CategoryData | null;
  onClose: () => void;
};

export function CategoryModal({ category, onClose }: CategoryModalProps) {
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [error, setError] = useState("");

  const { createCategory, isPending: isCreating } = useCreateCategory();

  const { updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // Client-side validation
    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (trimmedName.length > 60) {
      setError("Category name must be 60 characters or less.");
      return;
    }

    setError("");

    if (isEditing && category) {
      updateCategory(
        {
          id: category.id,
          data: {
            name: trimmedName,
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

    createCategory(
      {
        name: trimmedName,
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
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update the category name."
                : "Create a new product category."}
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
          <div>
            <label
              htmlFor="category-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Electronics"
              autoFocus
              disabled={isPending}
              maxLength={60}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />

            {/* Validation error */}
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

            {/* Character count */}
            <div className="mt-1.5 flex justify-end">
              <span className="text-xs text-slate-400">{name.length}/60</span>
            </div>
          </div>

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
              className="flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isEditing ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
