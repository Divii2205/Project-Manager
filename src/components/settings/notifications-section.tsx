"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/section";
import { setNotifyDeadlines } from "@/app/actions/account";

export type NotificationsSectionProps = {
  initialEnabled: boolean;
};

export function NotificationsSection({
  initialEnabled,
}: NotificationsSectionProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function toggle(next: boolean) {
    const previous = enabled;
    setEnabled(next);
    startTransition(async () => {
      try {
        await setNotifyDeadlines(next);
        toast.success(next ? "Reminders on" : "Reminders off");
      } catch {
        setEnabled(previous);
        toast.error("Could not change the setting. Try again.");
      }
    });
  }

  return (
    <Section
      title="Notifications"
      description="When the app is allowed to email you."
    >
      <div className="flex items-start justify-between gap-6 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1">
          <Label htmlFor="notify-deadlines">Deadline reminders</Label>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            One email a day listing any open project whose target date lands
            within a week. Nothing is sent when there is nothing due.
          </p>
        </div>
        <Switch
          id="notify-deadlines"
          checked={enabled}
          onCheckedChange={toggle}
          disabled={isPending}
        />
      </div>
    </Section>
  );
}
