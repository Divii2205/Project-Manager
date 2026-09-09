"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

/* The ledger row is a server component, but a hover preview needs client
   state. So the row stays on the server and hands its markup down: `trigger`
   is the row body, `children` is the preview panel. Both arrive already
   rendered — this file only owns the open/close behaviour and the overlay
   chrome (matched to `ui/popover.tsx` so the two read as one system).

   The card is a pointer affordance, so it is only mounted where a real
   pointer exists. That also keeps Radix's trigger away from touch devices,
   where it calls `preventDefault()` on touchstart and would swallow the tap
   that opens the project. */
export type RowHoverProps = {
  trigger: React.ReactElement;
  children: React.ReactNode;
  className?: string;
};

export function RowHover({ trigger, children, className }: RowHoverProps) {
  const [pointerFine, setPointerFine] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setPointerFine(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setPointerFine(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (!pointerFine) return trigger;

  return (
    <HoverCardPrimitive.Root openDelay={350} closeDelay={120}>
      <HoverCardPrimitive.Trigger asChild>{trigger}</HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={4}
          alignOffset={12}
          collisionPadding={16}
          className={cn(
            "z-50 w-[21rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1",
            "data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
            className,
          )}
        >
          {children}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
