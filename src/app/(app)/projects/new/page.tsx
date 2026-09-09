import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { createProject } from "@/app/actions/projects";
import { requireUserId } from "@/lib/projects";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireUserId();

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="New project"
        description="Only a title is required. Everything else can be filled in as the project takes shape."
      />
      <ProjectForm mode="create" onSubmit={createProject} />
    </div>
  );
}
