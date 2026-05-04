"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_REDIRECT = "/dashboard";

export function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onEmailSubmit = handleSubmit(async ({ email }) => {
    await signIn("resend", { email, redirectTo: DEFAULT_REDIRECT });
  });

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={googleLoading}
        onClick={() => {
          setGoogleLoading(true);
          void signIn("google", { redirectTo: DEFAULT_REDIRECT });
        }}
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onEmailSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Mail className="size-4" />
          )}
          Send magic link
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
    >
      <path
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.89-1.74 2.98-4.305 2.98-7.351z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.422l-3.232-2.51c-.896.6-2.04.954-3.387.954-2.604 0-4.81-1.76-5.596-4.122H3.064v2.59A9.997 9.997 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.404 13.9a6.005 6.005 0 0 1 0-3.8V7.51H3.064a9.997 9.997 0 0 0 0 8.98l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.977c1.469 0 2.786.505 3.823 1.496l2.866-2.867C16.96 2.99 14.696 2 12 2 8.094 2 4.736 4.236 3.064 7.51l3.34 2.59C7.19 7.737 9.395 5.977 12 5.977z"
        fill="#EA4335"
      />
    </svg>
  );
}
