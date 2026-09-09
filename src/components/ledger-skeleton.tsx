import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Matches the shape of `ProjectRow` so the list does not shift when the real
 *  rows arrive. */
export function LedgerSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border", className)}>
      <div className="hidden items-center gap-6 border-b border-border px-4 pb-2 lg:flex">
        <Skeleton className="h-3 w-16 flex-1" />
        <Skeleton className="h-3 w-10 shrink-0" />
        <Skeleton className="h-3 w-14 shrink-0" />
        <Skeleton className="h-3 w-12 shrink-0" />
      </div>
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="relative py-3.5 pl-4 pr-3">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-foreground/[0.07]" />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-3 w-[6.5rem]" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-[7.5rem]" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
