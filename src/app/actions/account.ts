"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/projects";
import { signOut } from "@/lib/auth";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Keep it under 100 characters")
    .transform((s) => (s.length > 0 ? s : null))
    .nullable(),
});

export async function updateProfile(input: { name: string }) {
  const userId = await requireUserId();
  const { name } = profileSchema.parse(input);

  await prisma.user.update({
    where: { id: userId },
    data: { name },
  });

  revalidatePath("/settings");
  revalidatePath("/", "layout");
}

export async function setNotifyDeadlines(value: boolean) {
  const userId = await requireUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { notifyDeadlines: Boolean(value) },
  });
  revalidatePath("/settings");
}

export async function deleteAccount() {
  const userId = await requireUserId();
  // Cascades to Project, Tag, Account, Session via Prisma onDelete: Cascade.
  await prisma.user.delete({ where: { id: userId } });
  await signOut({ redirectTo: "/login" });
}
