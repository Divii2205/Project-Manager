import type { Metadata } from "next";
import Link from "next/link";
import type { Priority, ProjectStatus } from "@prisma/client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProjectRow, ProjectRowHeader } from "@/components/project-row";
import { ProjectsFilters } from "@/components/projects/projects-filters";
import { PRIORITY_ORDER, STATUS_ORDER } from "@/lib/lifecycle";
import {
  countProjects,
  listProjects,
  requireUserId,
  toProjectRow,
  type ListProjectsParams,
} from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const userId = await requireUserId();
  const filters = parseFilters(searchParams);
  const [projects, total] = await Promise.all([
    listProjects(userId, filters),
    countProjects(userId),
  ]);

  const filtered =
    filters.q !== undefined ||
    filters.status !== undefined ||
    filters.priority !== undefined;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description={summarise(projects.length, total, filtered)}
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus />
              New project
            </Link>
          </Button>
        }
      />

      <ProjectsFilters />

      {projects.length === 0 ? (
        filtered ? (
          <EmptyState
            title="No projects match"
            description="Widen the search, or clear the stage and priority filters to see everything again."
          />
        ) : (
          <EmptyState
            title="No projects yet"
            description="Add the first one and it will show up here with its stage, progress, and target date."
            action={
              <Button asChild>
                <Link href="/projects/new">
                  <Plus />
                  New project
                </Link>
              </Button>
            }
          />
        )
      ) : (
        <div>
          <ProjectRowHeader />
          <ul className="divide-y divide-border border-b border-border">
            {projects.map((p) => (
              <ProjectRow key={p.id} project={toProjectRow(p)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function summarise(shown: number, total: number, filtered: boolean): string {
  if (total === 0) return "Nothing tracked yet.";
  const noun = total === 1 ? "project" : "projects";
  if (!filtered) return `${total} ${noun}.`;
  return `${shown} of ${total} ${noun} match.`;
}

function parseFilters(params: SearchParams): ListProjectsParams {
  const q = pickString(params.q);
  const statusRaw = pickString(params.status);
  const priorityRaw = pickString(params.priority);
  const sortRaw = pickString(params.sort);

  const status =
    statusRaw && (STATUS_ORDER as readonly string[]).includes(statusRaw)
      ? (statusRaw as ProjectStatus)
      : undefined;

  const priority =
    priorityRaw && (PRIORITY_ORDER as readonly string[]).includes(priorityRaw)
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
