import { ErrorState } from "@/components/error-state";

export default function AppNotFound() {
  return (
    <ErrorState
      title="Project not found"
      description="It was deleted, or it belongs to a different account."
      primary={{ label: "Back to projects", href: "/projects" }}
    />
  );
}
