import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your project portfolio at a glance."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Dashboard arrives in Phase 3"
        description="Stats, recent projects, and upcoming deadlines will land here."
      />
    </div>
  );
}
