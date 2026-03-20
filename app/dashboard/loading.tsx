import { SkeletonBlock } from "@/components/dashboard/ui";

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SkeletonBlock className="h-14 w-60 rounded-xl" />
        <SkeletonBlock className="h-6 w-full max-w-2xl rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-5">
                <SkeletonBlock className="h-5 w-28 rounded-lg" />
                <SkeletonBlock className="h-12 w-16 rounded-lg" />
              </div>
              <SkeletonBlock className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-6 py-5">
          <SkeletonBlock className="h-12 w-72 rounded-xl" />
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-6 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
            <SkeletonBlock className="h-6 w-24 rounded-lg" />
            <SkeletonBlock className="h-6 w-20 rounded-lg" />
            <SkeletonBlock className="h-6 w-20 rounded-lg" />
            <SkeletonBlock className="h-6 w-20 rounded-lg" />
          </div>

          <div className="space-y-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-6 border-b border-[var(--border)] px-6 py-5 last:border-b-0"
              >
                <SkeletonBlock className="h-6 w-32 rounded-lg" />
                <SkeletonBlock className="h-6 w-40 rounded-lg" />
                <SkeletonBlock className="h-6 w-24 rounded-lg" />
                <SkeletonBlock className="h-8 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-6 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/45 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-5 w-28 rounded-lg" />
                  <SkeletonBlock className="h-4 w-36 rounded-lg" />
                </div>
                <SkeletonBlock className="h-7 w-20 rounded-full" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <SkeletonBlock className="h-5 w-20 rounded-lg" />
                <SkeletonBlock className="h-4 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return <DashboardOverviewSkeleton />;
}
