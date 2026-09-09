import type { Priority } from "@prisma/client";

import { cn } from "@/lib/utils";
import { PRIORITY_META } from "@/lib/lifecycle";

const SEGMENTS = [0, 1, 2, 3];

export type PriorityMarkProps = {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
};

/** Four segments, filled to the priority level — priority is a quantity, so
 *  it reads as one rather than as another colour of dot. */
export function PriorityMark({
  priority,
  showLabel = false,
  className,
}: PriorityMarkProps) {
  const meta = PRIORITY_META[priority];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground",
        className,
      )}
      title={showLabel ? undefined : `${meta.label} priority`}
    >
      <span aria-hidden className="flex items-end gap-[2px]">
        {SEGMENTS.map((i) => (
          <span
            key={i}
            className={cn(
              "w-[2px] rounded-[1px]",
              i === 0 && "h-1.5",
              i === 1 && "h-2",
              i === 2 && "h-2.5",
              i === 3 && "h-3",
              i < meta.level ? meta.fill : "bg-foreground/[0.14]",
            )}
          />
        ))}
      </span>
      {showLabel ? meta.label : <span className="sr-only">{meta.label} priority</span>}
    </span>
  );
}
