"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Render both icons SSR-safe; cross-fade on theme change. */}
      <Sun
        className={
          mounted && isDark
            ? "hidden"
            : "size-4 text-muted-foreground"
        }
      />
      <Moon
        className={
          mounted && isDark
            ? "size-4 text-muted-foreground"
            : "hidden"
        }
      />
    </Button>
  );
}
