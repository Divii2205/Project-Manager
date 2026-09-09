import { format } from "date-fns";

/* Project dates are calendar dates, not instants. The form posts a bare
   YYYY-MM-DD, which `new Date()` parses as UTC midnight, so reading those
   values back with local getters rolls the day backwards for anyone west of
   UTC. Every read and write of a project date goes through this module. */

const DAY_MS = 86400000;

/** Re-anchors a UTC-midnight date so local formatters print the stored day. */
export function utcDay(d: Date): Date {
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

/** Default: "12 Mar". Pass a pattern for anything longer. */
export function formatDay(d: Date, pattern = "d MMM"): string {
  return format(utcDay(d), pattern);
}

export function formatDayLong(d: Date): string {
  return formatDay(d, "d MMM yyyy");
}

/** Value for a date input / DatePicker, taken from the stored UTC day. */
export function toDateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

/** Whole calendar days from today. Negative once the date has passed. */
export function daysUntil(d: Date, now: Date = new Date()): number {
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / DAY_MS);
}

/** Plain-language deadline, e.g. "due in 5 days", "3 days overdue". */
export function describeDue(d: Date, now: Date = new Date()): string {
  const days = daysUntil(d, now);
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days < -1) return Math.abs(days) + " days overdue";
  if (days <= 30) return "due in " + days + " days";
  return "due " + formatDay(d);
}
