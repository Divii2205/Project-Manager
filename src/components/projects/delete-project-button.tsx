"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { softDeleteProject } from "@/app/actions/projects";

export type DeleteProjectButtonProps = {
  projectId: string;
  projectTitle: string;
};

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {projectTitle}?</AlertDialogTitle>
          <AlertDialogDescription>
            It disappears from your dashboard and lists straight away. The
            record itself stays in the database, so it can be restored by hand
            if you ever need it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/[0.88]"
            onClick={(e) => {
              e.preventDefault();
              startTransition(async () => {
                await softDeleteProject(projectId);
              });
            }}
          >
            {isPending ? <Loader2 className="animate-spin" /> : null}
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
