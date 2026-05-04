import type { ProjectStatus } from "@prisma/client";

import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

const STATUS_ORDER: ProjectStatus[] = [
  "IDEA",
  "PLANNING",
  "IN_PROGRESS",
  "SHIPPED",
  "PAUSED",
  "ABANDONED",
];

export type StatusBreakdownProps = {
  byStatus: Record<ProjectStatus, number>;
  className?: string;
};

export function StatusBreakdown({ byStatus, className }: StatusBreakdownProps) {
  const total = STATUS_ORDER.reduce((sum, s) => sum + byStatus[s], 0);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        By status
      </h3>
      <ul className="space-y-2.5">
        {STATUS_ORDER.map((status) => {
          const count = byStatus[status];
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={status} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <StatusBadge status={status} />
                <span className="text-muted-foreground">
                  {count}
                  {total > 0 ? ` · ${pct}%` : null}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
