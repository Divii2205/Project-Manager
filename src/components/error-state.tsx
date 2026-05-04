import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ErrorStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primary?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  className?: string;
};

export function ErrorState({
  icon: Icon = AlertTriangle,
  title,
  description,
  primary,
  secondary,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-5" />
      </span>
      <div className="max-w-md space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {primary || secondary ? (
        <div className="flex flex-col-reverse items-center gap-2 sm:flex-row">
          {secondary ? (
            <Button asChild variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
          {primary ? (
            primary.href ? (
              <Button asChild>
                <Link href={primary.href}>{primary.label}</Link>
              </Button>
            ) : (
              <Button onClick={primary.onClick}>{primary.label}</Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
