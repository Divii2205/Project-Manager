import type { ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  IDEA: {
    label: "Idea",
    className:
      "bg-secondary text-muted-foreground ring-1 ring-inset ring-border",
  },
  PLANNING: {
    label: "Planning",
    className:
      "bg-lavender-100 text-lavender-700 ring-1 ring-inset ring-lavender-200 dark:bg-lavender-500/15 dark:text-lavender-300 dark:ring-lavender-500/30",
  },
  IN_PROGRESS: {
    label: "In progress",
    className:
      "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  },
  SHIPPED: {
    label: "Shipped",
    className:
      "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  PAUSED: {
    label: "Paused",
    className:
      "bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/30",
  },
  ABANDONED: {
    label: "Abandoned",
    className:
      "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
  },
};

export type StatusBadgeProps = {
  status: ProjectStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]!;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
