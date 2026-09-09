import type { Priority, ProjectStatus } from "@prisma/client";

import { STATUS_META } from "@/lib/lifecycle";
import { formatDay } from "@/lib/dates";

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

/* Palette matches the app: paper ground, warm ink, pine accent. Email clients
   need inline styles, so the values are literals rather than tokens. */
const PAPER = "#F6F5F2";
const SURFACE = "#FFFFFF";
const INK = "#1A1815";
const MUTED = "#6B6862";
const RULE = "#DFDCD4";
const PINE = "#12564A";

export function renderDeadlineEmail({
  name,
  projects,
  appUrl,
}: RenderDeadlineEmailParams): RenderedEmail {
  const greeting = name ? `Hi ${name},` : "Hi,";
  const count = projects.length;
  const subject =
    count === 1
      ? "1 project is due this week"
      : `${count} projects are due this week`;

  const items = projects.map((p) => ({
    ...p,
    dateLabel: p.targetEndDate ? formatDay(p.targetEndDate, "EEE d MMM") : "no date",
    statusLabel: STATUS_META[p.status].label,
  }));

  const text = [
    greeting,
    "",
    "These projects have a target date in the next seven days:",
    "",
    ...items.map((p) => `  - ${p.title}, due ${p.dateLabel} (${p.statusLabel})`),
    "",
    `Open your projects: ${appUrl}/projects`,
    "",
    "Turn these off any time in Settings.",
  ].join("\n");

  const rows = items
    .map(
      (p) => `
          <tr>
            <td style="padding:14px 16px;border-bottom:1px solid ${RULE};">
              <a href="${appUrl}/projects/${p.id}" style="color:${INK};text-decoration:none;font-weight:600;font-size:15px;">${escapeHtml(p.title)}</a>
              <div style="margin-top:3px;font-size:13px;color:${MUTED};">
                Due ${escapeHtml(p.dateLabel)} &nbsp;&middot;&nbsp; ${escapeHtml(p.statusLabel)}
              </div>
            </td>
          </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="font-size:13px;font-weight:600;letter-spacing:-0.01em;color:${INK};">
        Project Manager
      </div>

      <h1 style="font-size:22px;line-height:1.25;letter-spacing:-0.02em;margin:28px 0 10px;color:${INK};">
        ${escapeHtml(subject)}
      </h1>
      <p style="margin:0 0 6px;font-size:14px;color:${MUTED};">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${MUTED};">
        Each one has a target date in the next seven days. Open a title to see where it stands.
      </p>

      <table role="presentation" style="width:100%;border-collapse:collapse;background:${SURFACE};border:1px solid ${RULE};border-radius:4px;">
        ${rows}
      </table>

      <div style="margin-top:28px;">
        <a href="${appUrl}/projects" style="display:inline-block;background:${PINE};color:${PAPER};text-decoration:none;border-radius:2px;padding:10px 16px;font-size:14px;font-weight:500;">
          Open all projects
        </a>
      </div>

      <p style="margin:36px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
        You get these because deadline reminders are on.
        <a href="${appUrl}/settings" style="color:${PINE};">Turn them off in Settings.</a>
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
