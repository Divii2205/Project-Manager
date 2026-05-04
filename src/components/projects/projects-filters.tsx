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
import { STATUS_VALUES, PRIORITY_VALUES } from "@/lib/projects";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<(typeof STATUS_VALUES)[number], string> = {
  IDEA: "Idea",
  PLANNING: "Planning",
  IN_PROGRESS: "In progress",
  SHIPPED: "Shipped",
  PAUSED: "Paused",
  ABANDONED: "Abandoned",
};

const PRIORITY_LABEL: Record<(typeof PRIORITY_VALUES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const ALL = "ALL";
const SORT_OPTIONS = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "title", label: "Title (A–Z)" },
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
  const sort = searchParams.get("sort") ?? "updated";

  const [draftQ, setDraftQ] = useState(initialQ);

  // Keep local draft in sync if URL changes externally (e.g. clear button).
  useEffect(() => {
    setDraftQ(initialQ);
  }, [initialQ]);

  // Debounce search-input changes into the URL.
  useEffect(() => {
    if (draftQ === initialQ) return;
    const timer = setTimeout(() => {
      pushParam("q", draftQ);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftQ]);

  function pushParam(key: string, raw: string) {
    const params = new URLSearchParams(searchParams.toString());
    const value = raw === "" || raw === ALL ? null : raw;
    if (value === null) params.delete(key);
    else params.set(key, value);
    startTransition(() => {
      router.push(
        params.toString() === ""
          ? pathname
          : `${pathname}?${params.toString()}`,
      );
    });
  }

  const hasFilters =
    draftQ !== "" ||
    status !== ALL ||
    priority !== ALL ||
    sort !== "updated";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        isPending ? "opacity-90" : null,
        className,
      )}
    >
      <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          placeholder="Search title, tagline, description"
          className="pl-9"
          aria-label="Search projects"
        />
      </div>

      <Select value={status} onValueChange={(v) => pushParam("status", v)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => pushParam("priority", v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All priorities</SelectItem>
          {PRIORITY_VALUES.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => pushParam("sort", v)}>
        <SelectTrigger className="w-[180px]">
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraftQ("");
            startTransition(() => router.push(pathname));
          }}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
