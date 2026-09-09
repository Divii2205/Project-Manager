import Link from "next/link";
import type { ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import {
  STATUS_META,
  STATUS_OFF_PATH,
  STATUS_PATH,
} from "@/lib/lifecycle";

export type LifecycleSpineProps = {
  byStatus: Record<ProjectStatus, number>;
  className?: string;
};

const MAX_BAR = 84;
const MIN_BAR = 4;

/** The shape of the portfolio: the four stages a project travels through,
 *  drawn on a single baseline, with the two interrupted states set off below
 *  it. Each stage links to the filtered list. */
export function LifecycleSpine({ byStatus, className }: LifecycleSpineProps) {
  const pathCounts = STATUS_PATH.map((s) => byStatus[s]);
  const peak = Math.max(1, ...pathCounts);
  const offPath = STATUS_OFF_PATH.filter((s) => byStatus[s] > 0);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-end gap-px sm:gap-1">
        {STATUS_PATH.map((status, i) => {
          const meta = STATUS_META[status];
          const count = byStatus[status];
          const height =
            count === 0 ? MIN_BAR : Math.max(10, (count / peak) * MAX_BAR);

          return (
            <Link
              key={status}
              href={`/projects?status=${status}`}
              className={cn(
                "group flex flex-1 flex-col justify-end gap-2.5 rounded-t-sm px-2 pt-2",
                "transition-colors hover:bg-foreground/[0.03]",
              )}
            >
              <span className="tabular text-[1.375rem] font-semibold leading-none tracking-tighter text-foreground">
                {count}
              </span>
              <span
                aria-hidden
                className={cn(
                  "animate-grow w-full rounded-t-sm",
                  count === 0 ? "bg-foreground/[0.12]" : meta.fill,
                )}
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 70}ms`,
                }}
              />
            </Link>
          );
        })}
      </div>

      {/* The baseline the stages stand on. */}
      <div className="relative">
        <div className="h-px w-full bg-foreground/20" />
        <div className="flex gap-px pt-2.5 sm:gap-1">
          {STATUS_PATH.map((status) => (
            <span
              key={status}
              className="flex-1 truncate px-2 text-xs font-medium text-muted-foreground"
            >
              {STATUS_META[status].label}
            </span>
          ))}
        </div>
      </div>

      {offPath.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-border pt-4">
          <span className="text-xs text-muted-foreground/80">
            Off the path
          </span>
          {offPath.map((status) => {
            const meta = STATUS_META[status];
            return (
              <Link
                key={status}
                href={`/projects?status=${status}`}
                className="group inline-flex items-baseline gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  aria-hidden
                  className={cn("size-1.5 translate-y-[-1px] rounded-sm", meta.fill)}
                />
                <span className="tabular font-semibold text-foreground">
                  {byStatus[status]}
                </span>
                {meta.label.toLowerCase()}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
