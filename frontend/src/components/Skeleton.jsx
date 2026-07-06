export function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-white p-4">
          <SkeletonLine className="h-4 w-2/5" />
          <SkeletonLine className="mt-3 h-3 w-3/4" />
          <div className="mt-4 flex gap-2">
            <SkeletonLine className="h-6 w-20 rounded-full" />
            <SkeletonLine className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
