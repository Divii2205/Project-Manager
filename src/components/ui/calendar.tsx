"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-1 pb-1 relative items-center",
        caption_label: "text-sm font-medium tracking-tight",
        nav: "flex items-center justify-between absolute inset-x-0 top-1 px-1",
        button_previous: cn(
          "size-7 rounded-md border border-border bg-background text-muted-foreground",
          "hover:bg-secondary hover:text-foreground transition-colors",
          "inline-flex items-center justify-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),
        button_next: cn(
          "size-7 rounded-md border border-border bg-background text-muted-foreground",
          "hover:bg-secondary hover:text-foreground transition-colors",
          "inline-flex items-center justify-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "size-9 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center justify-center",
        week: "flex w-full mt-1",
        day: "size-9 p-0 text-center text-sm relative",
        day_button: cn(
          "size-9 inline-flex items-center justify-center rounded-md font-normal",
          "hover:bg-secondary hover:text-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground",
        ),
        selected: "",
        today:
          "[&:not([aria-selected])]:text-primary [&:not([aria-selected])]:font-semibold",
        outside: "text-muted-foreground/50",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: cls }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", cls)} />
          ) : (
            <ChevronRight className={cn("size-4", cls)} />
          ),
      }}
      {...props}
    />
  );
}
