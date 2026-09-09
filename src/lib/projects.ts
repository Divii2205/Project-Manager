import { cache } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Priority, Project, ProjectStatus, ProjectTag, Tag } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRIORITY_ORDER, STATUS_ORDER } from "@/lib/lifecycle";
// Type-only, so this does not pull a component into the data layer at runtime.
import type { ProjectRowData } from "@/components/project-row";

export type ProjectWithTags = Project & {
  projectTags: (ProjectTag & { tag: Tag })[];
};

/** Shapes a loaded project for the ledger row. Every page that lists projects
 *  goes through this instead of repeating the mapping inline. */
export function toProjectRow(project: ProjectWithTags): ProjectRowData {
  return {
    id: project.id,
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    targetEndDate: project.targetEndDate,
    actualEndDate: project.actualEndDate,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    designUrl: project.designUrl,
    docsUrl: project.docsUrl,
    tags: project.projectTags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      color: pt.tag.color,
    })),
  };
}

// ─── Auth helper ──────────────────────────────────────────────────────────────

export const requireUserId = cache(async (): Promise<string> => {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
});

// ─── Schemas ──────────────────────────────────────────────────────────────────

// The lifecycle vocabulary lives in one place; the schema reads it from there
// so the enum, the filter bar, and the form can never drift apart.
export const STATUS_VALUES = STATUS_ORDER;
export const PRIORITY_VALUES = PRIORITY_ORDER;

const dateString = z
  .string()
  .optional()
  .transform((s) => (s && s.length > 0 ? new Date(s) : null))
  .pipe(
    z
      .date()
      .nullable()
      .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date"),
  );

const urlString = z
  .string()
  .optional()
  .transform((s) => (s && s.length > 0 ? s.trim() : null))
  .pipe(
    z
      .string()
      .url("Must be a valid URL")
      .nullable(),
  );

export const projectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Keep it under 200 characters"),
  status: z.enum(STATUS_VALUES).default("IDEA"),
  tagline: z
    .string()
    .trim()
    .max(200, "Keep it under 200 characters")
    .optional()
    .transform((s) => (s && s.length > 0 ? s : null)),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : null)),
  techStack: z
    .array(z.string().trim().min(1).max(40))
    .max(20, "Up to 20 entries")
    .default([]),
  startDate: dateString,
  targetEndDate: dateString,
  actualEndDate: dateString,
  priority: z.enum(PRIORITY_VALUES).default("MEDIUM"),
  githubUrl: urlString,
  liveUrl: urlString,
  designUrl: urlString,
  docsUrl: urlString,
  notes: z.unknown().nullable().optional(),
  progress: z.coerce
    .number()
    .int()
    .min(0, "Progress is 0–100")
    .max(100, "Progress is 0–100")
    .default(0),
  tagNames: z
    .array(z.string().trim().min(1).max(40))
    .max(20)
    .default([]),
});

export type ProjectInput = z.input<typeof projectInputSchema>;
export type ProjectInputParsed = z.output<typeof projectInputSchema>;

// ─── Tag color palette ────────────────────────────────────────────────────────

// Mid-tone and desaturated on purpose: a tag colour is stored as a literal
// hex, so the same value has to stay legible on the paper ground and on the
// dark one. Saturated brights read as confetti once a few tags are on screen.
const TAG_PALETTE = [
  "#2F7D68", // pine
  "#4C6C8E", // slate
  "#A8762A", // ochre
  "#9C4A48", // claret
  "#6B7F3E", // moss
  "#7A5578", // plum
  "#9A6446", // clay
  "#3F7C82", // teal
];

export function tagColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length]!;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export type ListProjectsParams = {
  q?: string;
  status?: ProjectStatus;
  priority?: Priority;
  sort?: "updated" | "created" | "title";
};

export async function listProjects(
  userId: string,
  params: ListProjectsParams = {},
) {
  const { q, status, priority, sort = "updated" } = params;

  const orderBy =
    sort === "title"
      ? { title: "asc" as const }
      : sort === "created"
        ? { createdAt: "desc" as const }
        : { updatedAt: "desc" as const };

  return prisma.project.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(q && q.trim().length > 0
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { tagline: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy,
    include: {
      projectTags: { include: { tag: true } },
    },
  });
}

export async function countProjects(userId: string): Promise<number> {
  return prisma.project.count({ where: { userId, deletedAt: null } });
}

// Cached per-request: generateMetadata and the page component both fetch the
// same project — dedupe so it's a single round-trip to Neon.
export const getProject = cache(async (userId: string, id: string) => {
  return prisma.project.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      projectTags: { include: { tag: true } },
    },
  });
});

export type DashboardStats = {
  total: number;
  inProgress: number;
  shipped: number;
  upcomingDeadlines: number;
  overdue: number;
  byStatus: Record<ProjectStatus, number>;
};

/** Shipped and abandoned projects are closed, so deadline maths skips them. */
const OPEN_STATUSES: { notIn: ProjectStatus[] } = {
  notIn: ["SHIPPED", "ABANDONED"],
};

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const baseWhere = { userId, deletedAt: null };
  const now = new Date();

  const [total, statusCounts, upcomingDeadlines, overdue] = await Promise.all([
    prisma.project.count({ where: baseWhere }),
    prisma.project.groupBy({
      by: ["status"],
      where: baseWhere,
      _count: { _all: true },
    }),
    prisma.project.count({
      where: {
        ...baseWhere,
        targetEndDate: {
          gte: now,
          lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        },
        status: OPEN_STATUSES,
      },
    }),
    prisma.project.count({
      where: {
        ...baseWhere,
        targetEndDate: { lt: now },
        status: OPEN_STATUSES,
      },
    }),
  ]);

  const byStatus = {
    IDEA: 0,
    PLANNING: 0,
    IN_PROGRESS: 0,
    SHIPPED: 0,
    PAUSED: 0,
    ABANDONED: 0,
  } satisfies Record<ProjectStatus, number>;

  for (const row of statusCounts) {
    byStatus[row.status] = row._count._all;
  }

  return {
    total,
    inProgress: byStatus.IN_PROGRESS,
    shipped: byStatus.SHIPPED,
    upcomingDeadlines,
    overdue,
    byStatus,
  };
}

export async function getRecentProjects(userId: string, take = 5) {
  return prisma.project.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take,
    include: {
      projectTags: { include: { tag: true } },
    },
  });
}

/** Open projects with a target date already past or landing within two weeks.
 *  Soonest first, so the most pressing row is the one at the top. */
export async function getProjectsNeedingAttention(userId: string, take = 5) {
  return prisma.project.findMany({
    where: {
      userId,
      deletedAt: null,
      status: OPEN_STATUSES,
      targetEndDate: {
        not: null,
        lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { targetEndDate: "asc" },
    take,
    include: {
      projectTags: { include: { tag: true } },
    },
  });
}
