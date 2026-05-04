import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { renderDeadlineEmail } from "@/lib/emails/deadline-reminder";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromEmail = process.env.EMAIL_FROM;
  const resendKey = process.env.AUTH_RESEND_KEY;
  if (!fromEmail || !resendKey) {
    return NextResponse.json(
      { error: "Email provider is not configured" },
      { status: 500 },
    );
  }
  const resend = new Resend(resendKey);

  const now = new Date();
  const horizon = addDays(now, 7);
  const dedupeSince = addDays(now, -7);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const users = await prisma.user.findMany({
    where: { notifyDeadlines: true },
    select: { id: true, email: true, name: true },
  });

  const summary: Array<{ email: string; count: number; ok: boolean }> = [];

  for (const user of users) {
    if (!user.email) continue;

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        targetEndDate: { gte: now, lte: horizon },
        status: { notIn: ["SHIPPED", "ABANDONED"] },
        OR: [
          { lastDeadlineNotifiedAt: null },
          { lastDeadlineNotifiedAt: { lt: dedupeSince } },
        ],
      },
      select: {
        id: true,
        title: true,
        targetEndDate: true,
        status: true,
        priority: true,
      },
      orderBy: { targetEndDate: "asc" },
    });

    if (projects.length === 0) continue;

    const { subject, html, text } = renderDeadlineEmail({
      name: user.name,
      projects,
      appUrl,
    });

    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject,
        html,
        text,
      });
      await prisma.project.updateMany({
        where: { id: { in: projects.map((p) => p.id) } },
        data: { lastDeadlineNotifiedAt: now },
      });
      summary.push({ email: user.email, count: projects.length, ok: true });
    } catch (e) {
      console.error("Failed to send deadline email to", user.email, e);
      summary.push({ email: user.email, count: projects.length, ok: false });
    }
  }

  return NextResponse.json({ ok: true, processed: summary.length, summary });
}
