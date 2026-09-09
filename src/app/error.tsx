"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";

export default function RootError({
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
        title="Something went wrong"
        description="Try again. If it keeps happening, the database is probably unreachable."
        primary={{ label: "Try again", onClick: reset }}
        secondary={{ label: "Go home", href: "/" }}
        detail={error.digest ? `Reference ${error.digest}` : undefined}
      />
    </main>
  );
}
