"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Section } from "@/components/section";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? "light" : "light";

  return (
    <Section title="Appearance" description="Applies on this device.">
      <div
        role="radiogroup"
        aria-label="Theme"
        className="flex flex-wrap gap-2"
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = current === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[0.8125rem] transition-colors",
                active
                  ? "border-primary bg-primary/[0.07] font-medium text-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
