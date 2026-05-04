"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { setNotifyDeadlines } from "@/app/actions/account";

export type NotificationsSectionProps = {
  initialEnabled: boolean;
};

export function NotificationsSection({ initialEnabled }: NotificationsSectionProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function toggle(next: boolean) {
    const previous = enabled;
    setEnabled(next);
    startTransition(async () => {
      try {
        await setNotifyDeadlines(next);
        toast.success(
          next
            ? "Deadline reminders enabled"
            : "Deadline reminders turned off",
        );
      } catch {
        setEnabled(previous);
        toast.error("Couldn't update notification setting");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Decide when you want the app to nudge you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
          <div className="space-y-1">
            <Label htmlFor="notify-deadlines" className="text-sm font-medium">
              Deadline reminders
            </Label>
            <p className="text-xs text-muted-foreground">
              Email you when a project&apos;s target end date is within 7 days.
              You can change this any time.
            </p>
          </div>
          <Switch
            id="notify-deadlines"
            checked={enabled}
            onCheckedChange={toggle}
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
