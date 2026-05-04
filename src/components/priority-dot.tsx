import type { Priority } from "@prisma/client";

import { cn } from "@/lib/utils";

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; dot: string }
> = {
  LOW: { label: "Low", dot: "bg-muted-foreground/40" },
  MEDIUM: { label: "Medium", dot: "bg-lavender-400" },
  HIGH: { label: "High", dot: "bg-amber-500" },
  CRITICAL: { label: "Critical", dot: "bg-red-500" },
};

export type PriorityDotProps = {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
};

export function PriorityDot({
  priority,
  showLabel = false,
  className,
}: PriorityDotProps) {
  const config = PRIORITY_CONFIG[priority]!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", config.dot)} />
      {showLabel ? config.label : null}
    </span>
  );
}
