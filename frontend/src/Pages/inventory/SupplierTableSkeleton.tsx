export function SupplierTableSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-6 px-6 py-5"
                >
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />

                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="hidden h-4 w-32 animate-pulse rounded bg-slate-100 md:block" />
                    <div className="hidden h-4 w-36 animate-pulse rounded bg-slate-100 md:block" />
                    <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}