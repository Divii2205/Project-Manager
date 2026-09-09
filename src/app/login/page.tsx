import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Mark } from "@/components/mark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

/* Auth.js sends its own failures here via `pages.error`, so the messages are
   translated into something a person can act on. */
const ERRORS: Record<string, string> = {
  Configuration:
    "Sign-in is not configured correctly. Check the provider keys in the environment.",
  AccessDenied: "That account is not allowed to sign in.",
  Verification:
    "That sign-in link has expired or was already used. Request a new one.",
  OAuthAccountNotLinked:
    "That email already signs in another way. Use the method you set up first.",
  EmailSignin: "The sign-in email could not be sent. Try again in a moment.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string | string[] };
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const code = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;
  const message = code
    ? (ERRORS[code] ?? "Sign-in did not go through. Try again.")
    : null;

  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-[22rem]">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="text-[0.8125rem] font-semibold tracking-tight">
            Project Manager
          </span>
        </div>

        <h1 className="mt-9 text-2xl font-semibold tracking-tighter">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Everything you are building, from the first idea to the day it ships.
        </p>

        {message ? (
          <p
            role="alert"
            className="mt-6 border-l-2 border-destructive pl-3 text-[0.8125rem] leading-relaxed text-destructive"
          >
            {message}
          </p>
        ) : null}

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
