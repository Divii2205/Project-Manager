import Link from "next/link";
import type { Priority, ProjectStatus } from "@prisma/client";
import { FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { ProjectsFilters } from "@/components/projects/projects-filters";
import {
  PRIORITY_VALUES,
  STATUS_VALUES,
  listProjects,
  requireUserId,
  type ListProjectsParams,
} from "@/lib/projects";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const userId = await requireUserId();
  const filters = parseFilters(searchParams);
  const projects = await listProjects(userId, filters);

  const hasActiveFilters =
    filters.q !== undefined ||
    filters.status !== undefined ||
    filters.priority !== undefined;

  return (
    <div className="space-y-6">
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

      <ProjectsFilters />

      {projects.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects match these filters"
            description="Try clearing a filter or broadening your search."
          />
        ) : (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start tracking it here."
            action={
              <Button asChild>
                <Link href="/projects/new">
                  <Plus className="size-4" />
                  New project
                </Link>
              </Button>
            }
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={{
                id: p.id,
                title: p.title,
                tagline: p.tagline,
                description: p.description,
                status: p.status,
                priority: p.priority,
                techStack: p.techStack,
                progress: p.progress,
                startDate: p.startDate,
                targetEndDate: p.targetEndDate,
                githubUrl: p.githubUrl,
                liveUrl: p.liveUrl,
                designUrl: p.designUrl,
                docsUrl: p.docsUrl,
                tags: p.projectTags.map((pt) => ({
                  id: pt.tag.id,
                  name: pt.tag.name,
                  color: pt.tag.color,
                })),
                updatedAt: p.updatedAt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function parseFilters(params: SearchParams): ListProjectsParams {
  const q = pickString(params.q);
  const statusRaw = pickString(params.status);
  const priorityRaw = pickString(params.priority);
  const sortRaw = pickString(params.sort);

  const status =
    statusRaw && (STATUS_VALUES as readonly string[]).includes(statusRaw)
      ? (statusRaw as ProjectStatus)
      : undefined;

  const priority =
    priorityRaw && (PRIORITY_VALUES as readonly string[]).includes(priorityRaw)
      ? (priorityRaw as Priority)
      : undefined;

  const sort =
    sortRaw === "created" || sortRaw === "title" || sortRaw === "updated"
      ? sortRaw
      : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(sort ? { sort } : {}),
  };
}

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value && value.length > 0 ? value : undefined;
}
