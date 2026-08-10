import { FiArrowLeft, FiHome, FiMap } from "react-icons/fi";
import { useNavigate } from "react-router";

export function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-md text-center">

                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                    <FiMap
                        size={36}
                        className="text-slate-400"
                    />
                </div>

                {/* 404 */}
                <p className="mt-6 text-7xl font-bold tracking-tight text-slate-200">
                    404
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    Page not found
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Sorry, we couldn't find the page you're looking for.
                    The page may have been moved or the URL may be incorrect.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <FiArrowLeft size={16} />
                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <FiHome size={16} />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}