"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

/* The picker speaks bare YYYY-MM-DD, the same shape the form schema and the
   database use, so nothing shifts by a timezone on the way in or out. Dates
   here are parsed and formatted in local time throughout; the UTC helpers in
   lib/dates are for values read back out of the database. */
function parseDate(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Not set",
  ariaLabel,
  id,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = parseDate(value);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}
            className={cn(
              "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-sm border border-input bg-card px-2.5 text-sm",
              "transition-colors duration-150 hover:border-foreground/25",
              "disabled:cursor-not-allowed disabled:opacity-60",
              date ? "text-foreground" : "text-muted-foreground/70",
            )}
          >
            <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="tabular truncate">
              {date ? format(date, "d MMM yyyy") : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              onChange(d ? toIsoDate(d) : "");
              setOpen(false);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {date && !disabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Clear ${ariaLabel ?? "date"}`}
          onClick={() => onChange("")}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}
