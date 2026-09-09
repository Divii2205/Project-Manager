import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Focus is handled globally by a solid pine `:focus-visible` outline, so no
   variant here paints its own ring. */
const buttonVariants = cva(
  cn(
    "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-sm",
    "text-[0.8125rem] font-medium tracking-tight",
    "transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:size-[0.9375rem] [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/[0.88]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent",
        outline:
          "border border-input bg-card text-foreground hover:border-foreground/25 hover:bg-secondary/60",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        link: "text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/[0.88]",
        danger:
          "border border-destructive/35 bg-card text-destructive hover:border-destructive/60 hover:bg-destructive/[0.07]",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-10 px-5 text-sm",
        icon: "size-9",
        "icon-sm": "size-8 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
