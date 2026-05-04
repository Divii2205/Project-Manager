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
    <ErrorState
      title="Something went wrong"
      description="An unexpected error occurred. Try again — if it keeps happening, the database might be unreachable."
      primary={{ label: "Try again", onClick: reset }}
      secondary={{ label: "Go home", href: "/" }}
    />
  );
}
