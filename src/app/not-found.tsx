import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content items-center px-6 sm:px-8">
      <ErrorState
        title="Page not found"
        description="That address does not exist. The dashboard has everything you are tracking."
        primary={{ label: "Go to dashboard", href: "/dashboard" }}
      />
    </main>
  );
}
