import { Skeleton } from "@/components/ui/skeleton";
import { LedgerSkeleton } from "@/components/ledger-skeleton";

export default function ProjectsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 min-w-[12rem] flex-1" />
        <Skeleton className="h-9 w-[9.5rem]" />
        <Skeleton className="h-9 w-[9rem]" />
        <Skeleton className="h-9 w-[11rem]" />
      </div>

      <LedgerSkeleton rows={7} />
    </div>
  );
}
