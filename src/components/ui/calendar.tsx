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
        month_caption: "relative flex h-7 items-center justify-center",
        caption_label: "text-[0.8125rem] font-semibold tracking-tight",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          "inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground",
          "transition-colors hover:bg-secondary hover:text-foreground",
        ),
        button_next: cn(
          "inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground",
          "transition-colors hover:bg-secondary hover:text-foreground",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "inline-flex size-8 items-center justify-center text-[0.6875rem] font-medium text-muted-foreground",
        week: "mt-0.5 flex w-full",
        day: "relative size-8 p-0 text-center text-[0.8125rem]",
        day_button: cn(
          "tabular inline-flex size-8 items-center justify-center rounded-sm font-normal",
          "transition-colors hover:bg-secondary hover:text-foreground",
          "aria-selected:bg-primary aria-selected:font-medium aria-selected:text-primary-foreground",
          "aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground",
        ),
        selected: "",
        today:
          "[&:not([aria-selected])]:font-semibold [&:not([aria-selected])]:text-primary",
        outside: "text-muted-foreground/40",
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
