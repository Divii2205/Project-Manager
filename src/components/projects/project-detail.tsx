import Link from "next/link";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Layers,
  Palette,
  Pencil,
  Tag as TagIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { Project, ProjectTag, Tag } from "@prisma/client";

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

  const hasLinks =
    project.githubUrl ||
    project.liveUrl ||
    project.designUrl ||
    project.docsUrl;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="max-w-2xl text-base text-muted-foreground">
                {project.tagline}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8">
          {project.description ? (
            <Section title="Description">
              <p className="whitespace-pre-line text-sm leading-7 text-foreground">
                {project.description}
              </p>
            </Section>
          ) : null}

          <Section title="Notes">
            {hasNotes ? (
              <TiptapViewer content={project.notes as JSONContent} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No notes yet. Edit the project to start capturing ideas.
              </p>
            )}
          </Section>
        </div>

        <aside className="space-y-6">
          <MetaPanel title="Priority" icon={Layers}>
            <PriorityDot priority={project.priority} showLabel />
          </MetaPanel>

          <MetaPanel title="Timeline" icon={CalendarClock}>
            <ul className="space-y-1.5 text-sm">
              <DateLine label="Start" value={project.startDate} />
              <DateLine label="Target end" value={project.targetEndDate} />
              <DateLine label="Actual end" value={project.actualEndDate} />
            </ul>
          </MetaPanel>

          {project.techStack.length > 0 ? (
            <MetaPanel title="Tech stack" icon={Layers}>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </MetaPanel>
          ) : null}

          {project.projectTags.length > 0 ? (
            <MetaPanel title="Tags" icon={TagIcon}>
              <div className="flex flex-wrap gap-1.5">
                {project.projectTags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${tag.color}1F`,
                      color: tag.color,
                    }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </span>
                ))}
              </div>
            </MetaPanel>
          ) : null}

          {hasLinks ? (
            <MetaPanel title="Links" icon={ExternalLink}>
              <ul className="space-y-1">
                <LinkRow
                  href={project.githubUrl}
                  label="GitHub"
                  icon={Github}
                />
                <LinkRow
                  href={project.liveUrl}
                  label="Live"
                  icon={Globe}
                />
                <LinkRow
                  href={project.designUrl}
                  label="Design"
                  icon={Palette}
                />
                <LinkRow
                  href={project.docsUrl}
                  label="Docs"
                  icon={FileText}
                />
              </ul>
            </MetaPanel>
          ) : null}
        </aside>
      </div>
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
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MetaPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

function DateLine({ label, value }: { label: string; value: Date | null }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">
        {value ? format(value, "MMM d, yyyy") : "—"}
      </span>
    </li>
  );
}

function LinkRow({
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
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
      >
        <span className="flex items-center gap-2 text-foreground">
          <Icon className="size-4 text-muted-foreground" />
          {label}
        </span>
        <ExternalLink className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </li>
  );
}
