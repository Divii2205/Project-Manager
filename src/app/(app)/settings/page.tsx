import { Settings } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Account and preferences."
      />
      <EmptyState
        icon={Settings}
        title="Settings arrive in Phase 3"
        description="Profile and account controls will land here."
      />
    </div>
  );
}
