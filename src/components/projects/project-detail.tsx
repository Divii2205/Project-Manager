import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Flag,
  Github,
  Globe,
  Layers,
  Palette,
  Pencil,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Project, ProjectTag, Tag } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { PriorityDot } from "@/components/priority-dot";
import { TiptapViewer } from "@/components/editor/tiptap-viewer";
import type { JSONContent } from "@tiptap/react";

type ProjectWithTags = Project & {
  projectTags: (ProjectTag & { tag: Tag })[];
};

export type ProjectDetailProps = {
  project: ProjectWithTags;
  deleteSlot?: React.ReactNode;
};

export function ProjectDetail({ project, deleteSlot }: ProjectDetailProps) {
  const hasNotes =
    project.notes !== null &&
    project.notes !== undefined &&
    !(typeof project.notes === "object" &&
      project.notes !== null &&
      Object.keys(project.notes).length === 0);

  const hasTech = project.techStack.length > 0;
  const hasLinks = Boolean(
    project.githubUrl ||
      project.liveUrl ||
      project.designUrl ||
      project.docsUrl,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/projects/${project.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
            {deleteSlot}
          </div>
        </div>

        <ProgressBar progress={project.progress} />
      </header>

      {/* Meta boxes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Priority" icon={Flag} className="sm:col-span-2">
          <PriorityDot priority={project.priority} showLabel />
        </Panel>

        {/* Tech stack & links sit side by side; whichever is present alone
            spans the full width. */}
        {hasTech ? (
          <Panel
            title="Tech stack"
            icon={Layers}
            className={cn(!hasLinks && "sm:col-span-2")}
          >
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Panel>
        ) : null}

        {hasLinks ? (
          <Panel
            title="Links"
            icon={ExternalLink}
            className={cn(!hasTech && "sm:col-span-2")}
          >
            <div className="flex flex-wrap gap-2">
              <LinkButton href={project.githubUrl} label="GitHub" icon={Github} />
              <LinkButton href={project.liveUrl} label="Live" icon={Globe} />
              <LinkButton href={project.designUrl} label="Design" icon={Palette} />
              <LinkButton href={project.docsUrl} label="Docs" icon={FileText} />
            </div>
          </Panel>
        ) : null}
      </div>

      {/* Description & notes — clearly separated content cards. */}
      <ContentCard title="Description">
        {project.description ? (
          <p className="whitespace-pre-line text-sm leading-7 text-foreground">
            {project.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No description yet. Edit the project to add one.
          </p>
        )}
      </ContentCard>

      <ContentCard title="Notes">
        {hasNotes ? (
          <TiptapViewer content={project.notes as JSONContent} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No notes yet. Edit the project to start capturing ideas.
          </p>
        )}
      </ContentCard>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span className="font-medium text-foreground">{clamped}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lavender-500 to-lavender-400 transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/** Compact meta box (Priority / Tech stack / Links). */
function Panel({
  title,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

/** Larger separated section for long-form content (Description / Notes). */
function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-xs">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function LinkButton({
  href,
  label,
  icon: Icon,
}: {
  href: string | null;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
    >
      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      {label}
      <ExternalLink className="size-3 text-muted-foreground" />
    </a>
  );
}
