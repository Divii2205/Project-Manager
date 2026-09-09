import type { ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/lifecycle";

export type StatusBadgeProps = {
  status: ProjectStatus;
  /** `chip` for headers and detail; `inline` for dense ledger rows. */
  tone?: "chip" | "inline";
  className?: string;
};

export function StatusBadge({
  status,
  tone = "chip",
  className,
}: StatusBadgeProps) {
  const meta = STATUS_META[status];

  if (tone === "inline") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground",
          className,
        )}
      >
        <span className={cn("size-1.5 shrink-0 rounded-sm", meta.fill)} />
        {meta.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-sm px-1.5 py-[0.1875rem]",
        "text-[0.6875rem] font-semibold leading-none tracking-tight",
        meta.chip,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
