import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "default" | "emerald";
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          accent === "emerald"
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="space-y-0.5">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
