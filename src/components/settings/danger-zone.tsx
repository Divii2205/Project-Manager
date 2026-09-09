"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/section";
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
import { deleteAccount } from "@/app/actions/account";

const CONFIRM_PHRASE = "delete my account";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  const canDelete = confirm.trim().toLowerCase() === CONFIRM_PHRASE;

  function trigger() {
    if (!canDelete) return;
    startTransition(async () => {
      try {
        await deleteAccount();
      } catch (e) {
        // The action ends in signOut, which throws a redirect on success.
        if (e instanceof Error && /NEXT_REDIRECT/.test(e.message)) return;
        toast.error("Could not delete the account. Try again.");
      }
    });
  }

  return (
    <Section
      title="Delete account"
      description="Removes your account and everything in it. There is no undo and no export."
    >
      <div className="flex flex-col gap-4 rounded-lg border border-destructive/30 bg-destructive/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Every project, tag, note, and sign-in record is deleted permanently,
          including projects you previously moved to trash.
        </p>
        <AlertDialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setConfirm("");
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="shrink-0">
              <Trash2 />
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This deletes every project, tag, note, and sign-in record tied
                to your account. It cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm">
                Type{" "}
                <span className="font-mono text-foreground">
                  {CONFIRM_PHRASE}
                </span>{" "}
                to confirm
              </Label>
              <Input
                id="delete-confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  trigger();
                }}
                disabled={!canDelete || isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/[0.88]"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Delete forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Section>
  );
}
