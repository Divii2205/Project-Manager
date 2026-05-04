"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
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
    const merged = Array.from(new Set([...value, ...candidates]));
    onChange(merged);
    setDraft("");
  }

  function remove(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
        >
          {name}
          <button
            type="button"
            aria-label={`Remove ${name}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              remove(name);
            }}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <Input
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
        className="h-7 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
