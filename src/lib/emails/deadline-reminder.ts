import { format } from "date-fns";
import type { Priority, ProjectStatus } from "@prisma/client";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  PLANNING: "Planning",
  IN_PROGRESS: "In progress",
  SHIPPED: "Shipped",
  PAUSED: "Paused",
  ABANDONED: "Abandoned",
};

export type DeadlineReminderProject = {
  id: string;
  title: string;
  targetEndDate: Date | null;
  status: ProjectStatus;
  priority: Priority;
};

export type RenderDeadlineEmailParams = {
  name: string | null;
  projects: DeadlineReminderProject[];
  appUrl: string;
};

export type RenderedEmail = {
  subject: string;
  text: string;
  html: string;
};

export function renderDeadlineEmail({
  name,
  projects,
  appUrl,
}: RenderDeadlineEmailParams): RenderedEmail {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const count = projects.length;
  const subject =
    count === 1
      ? "1 project deadline this week"
      : `${count} project deadlines this week`;

  const items = projects.map((p) => ({
    ...p,
    dateLabel: p.targetEndDate
      ? format(p.targetEndDate, "EEE, MMM d")
      : "—",
  }));

  const text =
    `${greeting}\n\n` +
    `These projects have target deadlines in the next 7 days:\n\n` +
    items
      .map(
        (p) =>
          `  • ${p.title} — due ${p.dateLabel} (${STATUS_LABEL[p.status]})`,
      )
      .join("\n") +
    `\n\nOpen Project Manager: ${appUrl}/projects\n\n` +
    `— Project Manager`;

  const rows = items
    .map(
      (p) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;">
            <a href="${appUrl}/projects/${p.id}" style="color:#0f172a;text-decoration:none;font-weight:600;">
              ${escapeHtml(p.title)}
            </a>
            <div style="margin-top:2px;font-size:13px;color:#64748b;">
              Due ${p.dateLabel} · ${STATUS_LABEL[p.status]}
            </div>
          </td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="display:inline-block;background:#8B5CF6;color:#fff;border-radius:8px;padding:6px 10px;font-size:13px;font-weight:600;letter-spacing:.02em;">
        Project Manager
      </div>
      <h1 style="font-size:20px;margin:24px 0 8px;color:#0f172a;">${escapeHtml(subject)}</h1>
      <p style="margin:0 0 16px;color:#64748b;font-size:14px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;">
        These projects have target deadlines in the next 7 days. Tap a title to open it.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
      <div style="margin-top:32px;">
        <a href="${appUrl}/projects" style="display:inline-block;background:#8B5CF6;color:#fff;text-decoration:none;border-radius:8px;padding:10px 16px;font-size:14px;font-weight:500;">
          Open all projects &rarr;
        </a>
      </div>
      <p style="margin:32px 0 0;font-size:12px;color:#94a3b8;">
        You&apos;re receiving this because deadline reminders are turned on. You can change this in <a href="${appUrl}/settings" style="color:#8B5CF6;">Settings</a>.
      </p>
    </div>
  </body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
