import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-sm border border-input bg-card px-2.5 text-sm text-foreground",
        "transition-colors duration-150",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/25",
        "disabled:cursor-not-allowed disabled:bg-secondary/50 disabled:opacity-70",
        "aria-[invalid=true]:border-destructive",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";
