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
        "group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-xs",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-105",
          accent === "emerald"
            ? "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
            : "bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-primary/20",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="space-y-0.5">
        <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
