import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      {/* Ambient backdrop — soft lavender glow + faint grid for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_28rem_at_50%_-10%,hsl(var(--primary)/0.14),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(32rem_24rem_at_50%_30%,black,transparent)] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:44px_44px] opacity-50"
      />

      <div className="w-full max-w-sm space-y-8 animate-rise">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-600 text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-inset ring-white/15">
            <Sparkles className="size-6" />
          </span>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to keep track of your projects.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          A calm home for everything you&rsquo;re building.
        </p>
      </div>
    </main>
  );
}
