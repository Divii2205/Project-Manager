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
import { Section } from "@/components/section";
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
        toast.success("Profile saved");
        reset(values);
      } catch {
        toast.error("Could not save your profile. Try again.");
      }
    });
  });

  return (
    <Section title="Profile" description="How you appear inside the app.">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user.name}
            email={user.email}
            image={user.image}
            className="size-11 text-sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name?.trim() || "No display name set"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" placeholder="Your name" {...register("name")} />
            {errors.name?.message ? (
              <p role="alert" className="text-xs text-destructive">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Set by whichever provider you sign in with.
            </p>
          </div>
        </div>

        <div>
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? <Loader2 className="animate-spin" /> : null}
            Save profile
          </Button>
        </div>
      </form>
    </Section>
  );
}
