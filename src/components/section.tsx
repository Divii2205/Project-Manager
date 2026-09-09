import { cn } from "@/lib/utils";

export type SectionProps = {
  title: string;
  description?: string;
  /** Sits under the description, e.g. an import action. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** A page section: a hairline rule, a sentence-case heading with its
 *  explanation in the left column, and the controls in the right. Sections
 *  are not cards — nesting a card per section is what flattened the old
 *  hierarchy. */
export function Section({
  title,
  description,
  aside,
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        "grid gap-x-12 gap-y-4 border-t border-border py-7",
        "md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="space-y-2">
        <h2 className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="max-w-[34ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {aside}
      </div>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}
