import Link from "next/link";
import { ArrowUpRight, FileText, Github, Globe, Palette, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { JSONContent } from "@tiptap/react";

import { cn } from "@/lib/utils";
import type { ProjectWithTags } from "@/lib/projects";
import { STATUS_META, isClosed, priorityLabel } from "@/lib/lifecycle";
import { daysUntil, describeDue, formatDayLong } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { PriorityMark } from "@/components/priority-mark";
import { ProgressMeter } from "@/components/progress-meter";
import { TiptapViewer } from "@/components/editor/tiptap-viewer";

export type ProjectDetailProps = {
  project: ProjectWithTags;
  deleteSlot?: React.ReactNode;
};

export function ProjectDetail({ project, deleteSlot }: ProjectDetailProps) {
  const notes = readNotes(project.notes);
  const links = [
    { href: project.githubUrl, label: "GitHub", icon: Github },
    { href: project.liveUrl, label: "Live site", icon: Globe },
    { href: project.docsUrl, label: "Docs", icon: FileText },
    { href: project.designUrl, label: "Design", icon: Palette },
  ].filter((l) => l.href);

  return (
    <article className="space-y-10">
      <header className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <StatusBadge status={project.status} />
            {/* The one place a serif appears: a project is the only content
                in the app with a name of its own. */}
            <h1 className="font-display text-[2.125rem] leading-[1.06] tracking-tight text-foreground sm:text-[2.625rem]">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/projects/${project.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            {deleteSlot}
          </div>
        </div>

        <ProgressMeter
          value={project.progress}
          label="Progress"
          showValue
          className="max-w-md"
        />
      </header>

      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-10">
          {project.techStack.length > 0 ? (
            <Prose title="Tech stack">
              <ul className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-sm bg-secondary px-2 py-1 text-[0.8125rem] text-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Prose>
          ) : null}

          <Prose title="Description">
            {project.description ? (
              <p className="max-w-prose whitespace-pre-line text-[0.9375rem] leading-[1.7] text-foreground">
                {project.description}
              </p>
            ) : (
              <Absent>
                No description yet. Add one from the edit screen to record what
                this is and who it is for.
              </Absent>
            )}
          </Prose>

          <Prose title="Notes">
            {notes ? (
              <TiptapViewer content={notes} />
            ) : (
              <Absent>
                No notes yet. Use them for open questions, todos, and anything
                worth remembering next time you pick this up.
              </Absent>
            )}
          </Prose>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <dl className="border-t border-border text-[0.8125rem]">
            <Row label="Stage">
              <span className={cn("font-medium", STATUS_META[project.status].text)}>
                {STATUS_META[project.status].label}
              </span>
            </Row>
            <Row label="Priority">
              <PriorityMark
                priority={project.priority}
                showLabel
                className="text-[0.8125rem] text-foreground"
              />
              <span className="sr-only">{priorityLabel(project.priority)}</span>
            </Row>
            <Row label="Started">
              <Value date={project.startDate} />
            </Row>
            <Row label="Target">
              {project.targetEndDate ? (
                <span className="space-x-1.5">
                  <span className="tabular">
                    {formatDayLong(project.targetEndDate)}
                  </span>
                  {!isClosed(project.status) ? (
                    <span
                      className={cn(
                        "text-xs",
                        daysUntil(project.targetEndDate) < 0
                          ? "font-medium text-destructive"
                          : daysUntil(project.targetEndDate) <= 7
                            ? "font-medium text-signal"
                            : "text-muted-foreground",
                      )}
                    >
                      {describeDue(project.targetEndDate)}
                    </span>
                  ) : null}
                </span>
              ) : (
                <Dash />
              )}
            </Row>
            <Row label="Completed">
              <Value date={project.actualEndDate} />
            </Row>

            {project.projectTags.length > 0 ? (
              <Row label="Tags" align="start">
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {project.projectTags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 text-xs text-foreground"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-sm"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </Row>
            ) : null}

            {links.length > 0 ? (
              <Row label="Links" align="start">
                <div className="flex flex-col items-start gap-1.5">
                  {links.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 rounded-sm text-xs text-foreground transition-colors hover:text-primary"
                    >
                      <Icon className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                      {label}
                      <ArrowUpRight className="size-3 text-muted-foreground/60" />
                    </a>
                  ))}
                </div>
              </Row>
            ) : null}

            <Row label="Updated">
              <span className="text-muted-foreground">
                {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
              </span>
            </Row>
          </dl>
        </aside>
      </div>
    </article>
  );
}

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Absent({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function Row({
  label,
  align = "center",
  children,
}: {
  label: string;
  align?: "center" | "start";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </div>
  );
}

function Value({ date }: { date: Date | null }) {
  if (!date) return <Dash />;
  return <span className="tabular">{formatDayLong(date)}</span>;
}

function Dash() {
  return (
    <span className="text-muted-foreground/50" aria-label="not set">
      —
    </span>
  );
}

/** Tiptap writes `{}` for an empty document; treat that as no notes. */
function readNotes(value: ProjectWithTags["notes"]): JSONContent | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") return null;
  if (Object.keys(value).length === 0) return null;
  return value as JSONContent;
}
