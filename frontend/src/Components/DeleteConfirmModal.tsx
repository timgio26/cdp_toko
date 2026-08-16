import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

type DeleteConfirmModalProps = {
    open: boolean;
    title?: string;
    message?: string;
    itemName?: string;
    isDeleting?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function DeleteConfirmModal({
    open,
    title = "Delete Item",
    message = "Are you sure you want to delete this item?",
    itemName,
    isDeleting = false,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-start gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                        <FiAlertTriangle
                            size={21}
                            className="text-red-600"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                            {message}
                        </p>

                        {itemName && (
                            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                                <p className="truncate text-sm font-medium text-slate-700">
                                    {itemName}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={15} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}