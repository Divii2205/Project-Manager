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
      title="We couldn't load this page"
      description="Something went wrong while fetching your data. Try again, or head back to the dashboard."
      primary={{ label: "Try again", onClick: reset }}
      secondary={{ label: "Back to dashboard", href: "/dashboard" }}
    />
  );
}
