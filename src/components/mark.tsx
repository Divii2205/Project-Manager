import { cn } from "@/lib/utils";

/** The app mark: three ledger rules of decreasing length, cut out of pine.
 *  Same geometry as the PWA icon in `public/icon.svg`. */
export function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-full">
        <g fill="hsl(var(--primary-foreground))">
          <rect x="8" y="9" width="16" height="2.5" rx="1.25" />
          <rect x="8" y="14.75" width="11" height="2.5" rx="1.25" />
          <rect x="8" y="20.5" width="6" height="2.5" rx="1.25" />
        </g>
      </svg>
    </span>
  );
}
