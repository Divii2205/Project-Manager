import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-[22rem]">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-6" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="mt-9 h-8 w-28" />
        <Skeleton className="mt-3 h-4 w-full" />
        <div className="mt-8 space-y-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </main>
  );
}
