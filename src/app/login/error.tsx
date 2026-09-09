"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-content items-center px-6 sm:px-8">
      <ErrorState
        title="Sign-in could not start"
        description="The auth flow hit an error before it began. Try again, and check the provider keys if it persists."
        primary={{ label: "Try again", onClick: reset }}
        detail={error.digest ? `Reference ${error.digest}` : undefined}
      />
    </main>
  );
}
