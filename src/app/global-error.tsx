"use client";

import { useEffect } from "react";

/** Last resort: the root layout itself failed, so there are no app styles or
 *  fonts to rely on here. */
export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "1.5rem",
          margin: 0,
          background: "#F6F5F2",
          color: "#1A1815",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ maxWidth: "34rem", margin: "0 auto" }}>
          <div
            style={{ width: "2.5rem", height: "2px", background: "#8A3A38" }}
          />
          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: "1rem 0 0",
            }}
          >
            The app could not render
          </h1>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#6B6862",
            }}
          >
            Something failed before the interface loaded. Reloading usually
            clears it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 0.875rem",
              borderRadius: "2px",
              background: "#12564A",
              color: "#F1F0EC",
              border: "none",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.6875rem",
                color: "#8A8880",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Reference {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
