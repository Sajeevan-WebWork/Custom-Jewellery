import { SkeletonBlock } from "@/components/dashboard/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-5 w-28" />
        <SkeletonBlock className="h-14 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36 rounded-[1.5rem]" />
        ))}
      </div>
      <SkeletonBlock className="h-96 rounded-[1.5rem]" />
    </div>
  );
}

