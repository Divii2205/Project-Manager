import { Skeleton } from "@/components/ui/skeleton";
import { LedgerSkeleton } from "@/components/ledger-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 border-y border-border py-2.5">
        {[48, 62, 50, 82, 52].map((w, i) => (
          <div
            key={i}
            className="flex h-[0.9375rem] flex-row-reverse items-center gap-1.5"
          >
            <Skeleton className="h-3" style={{ width: `${w}px` }} />
            <Skeleton className="h-3.5 w-4" />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-5">
          <div className="flex items-end gap-1">
            {[64, 40, 84, 52].map((h, i) => (
              <div key={i} className="flex-1 px-2">
                <Skeleton className="w-full" style={{ height: `${h}px` }} />
              </div>
            ))}
          </div>
          <div>
            <div className="h-px w-full bg-foreground/20" />
            <div className="flex gap-1 pt-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex-1 px-2">
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-36" />
        <LedgerSkeleton rows={5} />
      </div>
    </div>
  );
}
