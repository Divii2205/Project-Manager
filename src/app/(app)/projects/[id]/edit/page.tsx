import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { JSONContent } from "@tiptap/react";

import { PageHeader } from "@/components/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import type { ProjectFormValues } from "@/components/projects/project-form";
import { updateProject } from "@/app/actions/projects";
import { getProject, requireUserId } from "@/lib/projects";
import { toDateInputValue } from "@/lib/dates";

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
    startDate: toDateInputValue(project.startDate),
    targetEndDate: toDateInputValue(project.targetEndDate),
    actualEndDate: toDateInputValue(project.actualEndDate),
    priority: project.priority,
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    designUrl: project.designUrl ?? "",
    docsUrl: project.docsUrl ?? "",
    notes: (project.notes as JSONContent | null | undefined) ?? null,
    progress: project.progress,
    tagNames: project.projectTags.map((pt) => pt.tag.name),
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to {project.title}
        </Link>
        <PageHeader title="Edit project" />
      </div>
      <ProjectForm
        mode="edit"
        defaultValues={defaults}
        onSubmit={updateProject.bind(null, project.id)}
      />
    </div>
  );
}
