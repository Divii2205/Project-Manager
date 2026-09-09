import { cn } from "@/lib/utils";

export type ProgressMeterProps = {
  value: number;
  /** Adds a right-aligned percentage. */
  showValue?: boolean;
  label?: string;
  /** Overrides the accessible name when no visible label is shown. */
  ariaLabel?: string;
  className?: string;
  barClassName?: string;
};

/** A flat pine fill on a hairline track. No gradient — the bar reports a
 *  number, it is not decoration. */
export function ProgressMeter({
  value,
  showValue = false,
  label,
  ariaLabel,
  className,
  barClassName,
}: ProgressMeterProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("space-y-1.5", className)}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
          {label ? <span>{label}</span> : <span />}
          {showValue ? (
            <span className="tabular font-medium text-foreground">{pct}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? label ?? "Progress"}
        className={cn(
          "h-1 w-full overflow-hidden rounded-full bg-foreground/[0.09]",
          barClassName,
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
