import type { Metadata } from "next";
import Link from "next/link";

import { Mark } from "@/components/mark";

export const metadata: Metadata = { title: "Check your email" };

/** Auth.js `pages.verifyRequest` points here so the step after requesting a
 *  magic link is a real page instead of the library default. */
export default function CheckEmailPage() {
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
          Check your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A sign-in link is on its way. It works once and expires in 24 hours,
          so open it on the device you want to stay signed in on.
        </p>

        <div className="mt-8 border-t border-border pt-4">
          <Link
            href="/login"
            className="rounded-sm text-[0.8125rem] text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
          >
            Use a different email
          </Link>
        </div>
      </div>
    </main>
  );
}
