import { useState } from "react";
import type { SupplierData } from "../../utils/inventoryQuery";
import {
  useCreateSupplier,
  useUpdateSupplier,
} from "../../utils/inventoryQuery";

type SupplierModalProps = {
  supplier: SupplierData | null;
  onClose: () => void;
};

export function SupplierModal({ supplier, onClose }: SupplierModalProps) {
  const isEditing = Boolean(supplier);

  const [name, setName] = useState(supplier?.name ?? "");
  const [contactPerson, setContactPerson] = useState(
    supplier?.contact_person ?? "",
  );
  const [phone, setPhone] = useState(supplier?.phone ?? "");
  const [email, setEmail] = useState(supplier?.email ?? "");

  const [error, setError] = useState("");

  const { createSupplier, isPending: isCreating } = useCreateSupplier();

  const { updateSupplier, isPending: isUpdating } = useUpdateSupplier();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Supplier name is required.");
      return;
    }

    if (trimmedName.length > 120) {
      setError("Supplier name must be 120 characters or less.");
      return;
    }

    setError("");

    const data = {
      name: trimmedName,
      contact_person: contactPerson.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
    };

    if (isEditing && supplier) {
      updateSupplier(
        {
          id: supplier.id,
          data,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );

      return;
    }

    createSupplier(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditing
                ? "Update supplier information."
                : "Add a new supplier to your inventory."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-xl text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label
              htmlFor="supplier-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Supplier Name
            </label>

            <input
              id="supplier-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. PT Maju Bersama"
              maxLength={120}
              disabled={isPending}
              autoFocus
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50"
                  : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              }`}
            />

            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contact-person"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Contact Person
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="contact-person"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. John Smith"
              maxLength={120}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="supplier-phone"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Phone
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="supplier-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812-1234-5678"
              maxLength={40}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="supplier-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="supplier-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@example.com"
              maxLength={120}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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

              {isEditing ? "Save Changes" : "Create Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
