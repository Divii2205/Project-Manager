"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      closeButton
      // Sonner is styled from the app tokens rather than its own palette, so
      // toasts match every other surface in both themes.
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
          title: "text-[0.8125rem] font-medium",
          description: "text-xs text-muted-foreground",
          actionButton: "rounded-sm bg-primary text-primary-foreground",
          cancelButton: "rounded-sm bg-secondary text-secondary-foreground",
          closeButton: "rounded-sm border-border bg-popover text-muted-foreground",
          success: "[&_[data-icon]]:text-primary",
          error: "[&_[data-icon]]:text-destructive",
        },
      }}
    />
  );
}
