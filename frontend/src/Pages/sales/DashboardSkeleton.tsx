export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="h-[420px] animate-pulse rounded-2xl bg-white" />
          <div className="h-[420px] animate-pulse rounded-2xl bg-white" />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="h-[400px] animate-pulse rounded-2xl bg-white" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    </main>
  );
}