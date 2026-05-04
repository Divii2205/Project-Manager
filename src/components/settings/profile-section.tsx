"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/layout/user-avatar";
import { updateProfile } from "@/app/actions/account";

const schema = z.object({
  name: z.string().trim().max(100, "Keep it under 100 characters"),
});

type FormValues = z.infer<typeof schema>;

export type ProfileSectionProps = {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
};

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name ?? "" },
  });

  const submit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        await updateProfile({ name: values.name });
        toast.success("Profile updated");
        reset(values);
      } catch {
        toast.error("Couldn't update profile");
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How you appear inside the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              email={user.email}
              image={user.image}
              className="size-14 text-base"
            />
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name ?? "Set a display name"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                placeholder="Your name"
                {...register("name")}
              />
              {errors.name?.message ? (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                readOnly
                className="cursor-not-allowed bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">
                Email comes from your sign-in provider.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
