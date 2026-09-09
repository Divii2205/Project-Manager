import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/form-skeleton";

export default function NewProjectLoading() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <FormSkeleton sections={4} />
    </div>
  );
}
