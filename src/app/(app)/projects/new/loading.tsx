import { Skeleton } from "@/components/ui/skeleton";

export default function NewProjectLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card shadow-xs p-6"
        >
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
