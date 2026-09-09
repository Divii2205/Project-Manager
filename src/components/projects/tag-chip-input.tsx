"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type TagChipInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export function TagChipInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: TagChipInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    const candidates = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (candidates.length === 0) return;
    onChange(Array.from(new Set([...value, ...candidates])));
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1 rounded-sm border border-input bg-card p-1",
        "transition-colors focus-within:border-foreground/25",
        "focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-ring",
        className,
      )}
    >
      {value.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1 rounded-sm bg-secondary py-0.5 pl-1.5 pr-1 text-xs text-foreground"
        >
          {name}
          <button
            type="button"
            aria-label={`Remove ${name}`}
            className="rounded-sm text-muted-foreground transition-colors hover:text-destructive"
            onClick={() => onChange(value.filter((v) => v !== name))}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        aria-label={ariaLabel}
        value={draft}
        placeholder={value.length === 0 ? placeholder : undefined}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            e.preventDefault();
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        className={cn(
          "h-7 min-w-[8rem] flex-1 bg-transparent px-1.5 text-sm text-foreground",
          "outline-none placeholder:text-muted-foreground/70",
        )}
      />
    </div>
  );
}
