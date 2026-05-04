import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { getProject, requireUserId } from "@/lib/projects";

type PageProps = { params: { id: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const userId = await requireUserId();
  const project = await getProject(userId, params.id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const userId = await requireUserId();
  const project = await getProject(userId, params.id);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
