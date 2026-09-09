import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-72 max-w-full" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="max-w-md space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>

      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-10">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full max-w-prose" />
              <Skeleton className="h-4 w-11/12 max-w-prose" />
              <Skeleton className="h-4 w-2/3 max-w-prose" />
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 border-b border-border py-2.5"
            >
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
