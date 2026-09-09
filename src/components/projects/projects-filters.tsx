"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "@/lib/lifecycle";
import { cn } from "@/lib/utils";

const ALL = "ALL";
const DEFAULT_SORT = "updated";

const SORT_OPTIONS = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "title", label: "Title A–Z" },
];

export type ProjectsFiltersProps = {
  className?: string;
};

export function ProjectsFilters({ className }: ProjectsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialQ = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? ALL;
  const priority = searchParams.get("priority") ?? ALL;
  const sort = searchParams.get("sort") ?? DEFAULT_SORT;

  const [draftQ, setDraftQ] = useState(initialQ);

  // Re-sync when the URL changes from outside the input (clear, back button).
  useEffect(() => {
    setDraftQ(initialQ);
  }, [initialQ]);

  // Debounce typing into the URL.
  useEffect(() => {
    if (draftQ === initialQ) return;
    const timer = setTimeout(() => pushParam("q", draftQ), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftQ]);

  function pushParam(key: string, raw: string) {
    const params = new URLSearchParams(searchParams.toString());
    const value = raw === "" || raw === ALL ? null : raw;
    if (value === null) params.delete(key);
    else params.set(key, value);
    startTransition(() => {
      const query = params.toString();
      router.push(query === "" ? pathname : `${pathname}?${query}`);
    });
  }

  // Sort is a view preference, not a filter, so clearing leaves it alone.
  const hasFilters = draftQ !== "" || status !== ALL || priority !== ALL;

  function clearFilters() {
    setDraftQ("");
    const params = new URLSearchParams();
    if (sort !== DEFAULT_SORT) params.set("sort", sort);
    startTransition(() => {
      const query = params.toString();
      router.push(query === "" ? pathname : `${pathname}?${query}`);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 transition-opacity",
        isPending && "opacity-70",
        className,
      )}
    >
      <div className="relative min-w-[12rem] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          placeholder="Search projects"
          className="pl-8"
          aria-label="Search projects"
        />
      </div>

      <Select value={status} onValueChange={(v) => pushParam("status", v)}>
        <SelectTrigger className="w-[9.5rem]" aria-label="Filter by stage">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any stage</SelectItem>
          {STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => pushParam("priority", v)}>
        <SelectTrigger className="w-[9rem]" aria-label="Filter by priority">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any priority</SelectItem>
          {PRIORITY_ORDER.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_META[p].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => pushParam("sort", v)}>
        <SelectTrigger className="w-[11rem]" aria-label="Sort projects">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
