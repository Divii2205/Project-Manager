import { FolderSearch } from "lucide-react";

import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <ErrorState
        icon={FolderSearch}
        title="Page not found"
        description="That URL doesn't exist."
        primary={{ label: "Go home", href: "/" }}
      />
    </main>
  );
}
