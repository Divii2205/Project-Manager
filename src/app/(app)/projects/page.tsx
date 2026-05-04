import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Everything you're building, in one place."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        }
      />
      <EmptyState
        icon={FolderKanban}
        title="Project list arrives in Phase 3"
        description="Filters, search, and the full project grid will land here."
      />
    </div>
  );
}
