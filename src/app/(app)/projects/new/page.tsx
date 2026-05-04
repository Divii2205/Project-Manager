import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { createProject } from "@/app/actions/projects";
import { requireUserId } from "@/lib/projects";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  await requireUserId();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New project"
        description="Capture an idea and start tracking it."
      />
      <ProjectForm mode="create" onSubmit={createProject} />
    </div>
  );
}
