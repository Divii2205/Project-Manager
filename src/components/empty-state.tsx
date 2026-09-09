import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/** An empty screen is an invitation to act, so it leads with the sentence
 *  that says what to do — no illustration, no icon in a tinted ring. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-card/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mx-auto max-w-sm space-y-2">
        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
