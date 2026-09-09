"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";

export default function AppError({
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
      title="This page could not load"
      description="The data did not come back. Try again, or head to the dashboard."
      primary={{ label: "Try again", onClick: reset }}
      secondary={{ label: "Dashboard", href: "/dashboard" }}
      detail={error.digest ? `Reference ${error.digest}` : undefined}
    />
  );
}
