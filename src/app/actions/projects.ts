"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  projectInputSchema,
  requireUserId,
  tagColorFor,
  type ProjectInput,
} from "@/lib/projects";

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createProject(input: ProjectInput) {
  const userId = await requireUserId();
  const data = projectInputSchema.parse(input);

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        userId,
        title: data.title,
        status: data.status,
        tagline: data.tagline,
        description: data.description,
        techStack: data.techStack,
        startDate: data.startDate,
        targetEndDate: data.targetEndDate,
        actualEndDate: data.actualEndDate,
        priority: data.priority,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        designUrl: data.designUrl,
        docsUrl: data.docsUrl,
        notes:
          data.notes === undefined || data.notes === null
            ? Prisma.JsonNull
            : (data.notes as Prisma.InputJsonValue),
        progress: data.progress,
      },
    });

    if (data.tagNames.length > 0) {
      await syncTagsForProject(tx, userId, created.id, data.tagNames);
    }

    return created;
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateProject(id: string, input: ProjectInput) {
  const userId = await requireUserId();
  const data = projectInputSchema.parse(input);

  const owned = await prisma.project.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Project not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: {
        title: data.title,
        status: data.status,
        tagline: data.tagline,
        description: data.description,
        techStack: data.techStack,
        startDate: data.startDate,
        targetEndDate: data.targetEndDate,
        actualEndDate: data.actualEndDate,
        priority: data.priority,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        designUrl: data.designUrl,
        docsUrl: data.docsUrl,
        notes:
          data.notes === undefined || data.notes === null
            ? Prisma.JsonNull
            : (data.notes as Prisma.InputJsonValue),
        progress: data.progress,
      },
    });

    await tx.projectTag.deleteMany({ where: { projectId: id } });
    if (data.tagNames.length > 0) {
      await syncTagsForProject(tx, userId, id, data.tagNames);
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

// ─── Soft delete ──────────────────────────────────────────────────────────────

export async function softDeleteProject(id: string) {
  const userId = await requireUserId();

  const owned = await prisma.project.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true },
  });
  if (!owned) {
    throw new Error("Project not found");
  }

  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/projects");
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function syncTagsForProject(
  tx: TxClient,
  userId: string,
  projectId: string,
  tagNames: string[],
) {
  const uniqueNames = Array.from(
    new Set(tagNames.map((n) => n.trim()).filter(Boolean)),
  );
  if (uniqueNames.length === 0) return;

  const tags = await Promise.all(
    uniqueNames.map((name) =>
      tx.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { userId, name, color: tagColorFor(name) },
      }),
    ),
  );

  await tx.projectTag.createMany({
    data: tags.map((tag) => ({ projectId, tagId: tag.id })),
    skipDuplicates: true,
  });
}
