import { redirect } from "next/navigation";
import { z } from "zod";
import type { Priority, ProjectStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── Auth helper ──────────────────────────────────────────────────────────────

export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const STATUS_VALUES = [
  "IDEA",
  "PLANNING",
  "IN_PROGRESS",
  "SHIPPED",
  "PAUSED",
  "ABANDONED",
] as const satisfies readonly ProjectStatus[];

export const PRIORITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const satisfies readonly Priority[];

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

const TAG_PALETTE = [
  "#8B5CF6", // lavender
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#3B82F6", // blue
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
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

export async function getProject(userId: string, id: string) {
  return prisma.project.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      projectTags: { include: { tag: true } },
    },
  });
}

export type DashboardStats = {
  total: number;
  inProgress: number;
  shipped: number;
  upcomingDeadlines: number;
  byStatus: Record<ProjectStatus, number>;
};

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const baseWhere = { userId, deletedAt: null };

  const [total, statusCounts, upcomingDeadlines] = await Promise.all([
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
          gte: new Date(),
          lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        status: { notIn: ["SHIPPED", "ABANDONED"] },
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
    byStatus,
  };
}

export async function getRecentProjects(userId: string, take = 5) {
  return prisma.project.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take,
  });
}
