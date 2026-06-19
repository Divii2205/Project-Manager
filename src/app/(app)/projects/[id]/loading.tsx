import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs sm:col-span-2">
          <Skeleton className="mb-3 h-3 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <Skeleton className="mb-3 h-3 w-24" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-xs">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
