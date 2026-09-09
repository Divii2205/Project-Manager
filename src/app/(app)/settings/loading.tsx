import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/form-skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl space-y-8">
      <Skeleton className="h-7 w-24" />
      <FormSkeleton sections={4} />
    </div>
  );
}
