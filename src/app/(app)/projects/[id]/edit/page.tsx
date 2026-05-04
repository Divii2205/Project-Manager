import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import type { ProjectFormValues } from "@/components/projects/project-form";
import { updateProject } from "@/app/actions/projects";
import { getProject, requireUserId } from "@/lib/projects";

type PageProps = { params: { id: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const userId = await requireUserId();
  const project = await getProject(userId, params.id);
  return { title: project ? `Edit ${project.title}` : "Edit project" };
}

export default async function EditProjectPage({ params }: PageProps) {
  const userId = await requireUserId();
  const project = await getProject(userId, params.id);
  if (!project) notFound();

  const defaults: ProjectFormValues = {
    title: project.title,
    status: project.status,
    tagline: project.tagline ?? "",
    description: project.description ?? "",
    techStack: project.techStack,
    startDate: toDateInput(project.startDate),
    targetEndDate: toDateInput(project.targetEndDate),
    actualEndDate: toDateInput(project.actualEndDate),
    priority: project.priority,
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    designUrl: project.designUrl ?? "",
    docsUrl: project.docsUrl ?? "",
    notes: (project.notes as JSONContent | null | undefined) ?? null,
    progress: project.progress,
    tagNames: project.projectTags.map((pt) => pt.tag.name),
  };

  const action = updateProject.bind(null, project.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit project"
        description={project.title}
      />
      <ProjectForm mode="edit" defaultValues={defaults} onSubmit={action} />
    </div>
  );
}

function toDateInput(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}
