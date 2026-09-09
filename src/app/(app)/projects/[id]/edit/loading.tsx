import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/form-skeleton";

export default function EditProjectLoading() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-36" />
      </div>
      <FormSkeleton sections={4} />
    </div>
  );
}
