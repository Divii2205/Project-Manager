"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteAccount } from "@/app/actions/account";

const CONFIRM_PHRASE = "delete my account";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  function trigger() {
    if (confirm.trim().toLowerCase() !== CONFIRM_PHRASE) return;
    startTransition(async () => {
      try {
        await deleteAccount();
      } catch (e) {
        // signOut throws a redirect; ignore that, surface anything else.
        if (e instanceof Error && /NEXT_REDIRECT/.test(e.message)) return;
        toast.error("Couldn't delete account. Please try again.");
      }
    });
  }

  const canDelete = confirm.trim().toLowerCase() === CONFIRM_PHRASE;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Permanent, irreversible actions live here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Delete your account
            </p>
            <p className="text-xs text-muted-foreground">
              All your projects, tags, and notes will be permanently removed.
            </p>
          </div>
          <AlertDialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setConfirm("");
            }}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shrink-0">
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your projects, tags, notes, and
                  sign-in records. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="delete-confirm" className="text-xs">
                  Type{" "}
                  <span className="font-mono text-foreground">
                    {CONFIRM_PHRASE}
                  </span>{" "}
                  to confirm.
                </Label>
                <Input
                  id="delete-confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    trigger();
                  }}
                  disabled={!canDelete || isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
