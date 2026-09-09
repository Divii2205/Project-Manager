import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the two-column `Section` rhythm used by the project form and
 *  settings, so those pages do not reflow on hydration. */
export function FormSkeleton({ sections = 4 }: { sections?: number }) {
  return (
    <div>
      {Array.from({ length: sections }).map((_, i) => (
        <div
          key={i}
          className="grid gap-x-12 gap-y-4 border-t border-border py-7 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
