import { FolderSearch } from "lucide-react";

import { ErrorState } from "@/components/error-state";

export default function AppNotFound() {
  return (
    <ErrorState
      icon={FolderSearch}
      title="We couldn't find that"
      description="The project may have been deleted, or it doesn't belong to your account."
      primary={{ label: "Back to projects", href: "/projects" }}
    />
  );
}
