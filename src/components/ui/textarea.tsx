import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[88px] w-full rounded-sm border border-input bg-card px-2.5 py-2 text-sm leading-relaxed text-foreground",
        "transition-colors duration-150",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/25",
        "disabled:cursor-not-allowed disabled:opacity-70",
        "aria-[invalid=true]:border-destructive",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
