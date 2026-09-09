import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ErrorStateProps = {
  title: string;
  description?: string;
  /** Shown in small type under the actions, e.g. an error digest. */
  detail?: string;
  primary?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  className?: string;
};

/** States what went wrong and what to do about it. No apology, no icon. */
export function ErrorState({
  title,
  description,
  detail,
  primary,
  secondary,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-start justify-center gap-5",
        className,
      )}
    >
      <div className="max-w-prose space-y-2">
        <p className="h-px w-10 bg-destructive" aria-hidden />
        <h2 className="pt-3 text-xl font-semibold tracking-tighter text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {primary || secondary ? (
        <div className="flex flex-wrap items-center gap-2">
          {primary ? (
            primary.href ? (
              <Button asChild>
                <Link href={primary.href}>{primary.label}</Link>
              </Button>
            ) : (
              <Button onClick={primary.onClick}>{primary.label}</Button>
            )
          ) : null}
          {secondary ? (
            <Button asChild variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
      {detail ? (
        <p className="font-mono text-[0.6875rem] text-muted-foreground/70">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
