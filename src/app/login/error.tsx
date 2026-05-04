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
    <ErrorState
      title="Couldn't sign you in"
      description="The auth flow hit an error. Try again — if it persists, double-check your provider keys."
      primary={{ label: "Try again", onClick: reset }}
    />
  );
}
