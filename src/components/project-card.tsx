import Link from "next/link";
import { format } from "date-fns";
import {
  ExternalLink,
  FileText,
  Github,
  Globe,
  Palette,
} from "lucide-react";
import type { Priority, ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { PriorityDot } from "@/components/priority-dot";

export type ProjectCardTag = {
  id: string;
  name: string;
  color: string;
};

export type ProjectCardData = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  techStack: string[];
  progress: number;
  startDate: Date | null;
  targetEndDate: Date | null;
  githubUrl: string | null;
  liveUrl: string | null;
  designUrl: string | null;
  docsUrl: string | null;
  tags: ProjectCardTag[];
  updatedAt: Date;
};

export type ProjectCardProps = {
  project: ProjectCardData;
  className?: string;
};

const MAX_TECH = 4;
const MAX_TAGS = 3;

export function ProjectCard({ project, className }: ProjectCardProps) {
  const subtitle = project.tagline ?? project.description ?? null;
  const dateRange = formatDateRange(project.startDate, project.targetEndDate);
  const techShown = project.techStack.slice(0, MAX_TECH);
  const techExtra = Math.max(0, project.techStack.length - MAX_TECH);
  const tagsShown = project.tags.slice(0, MAX_TAGS);
  const tagsExtra = Math.max(0, project.tags.length - MAX_TAGS);

  const links: Array<{
    href: string | null;
    label: string;
    icon: typeof Github;
  }> = [
    { href: project.githubUrl, label: "GitHub", icon: Github },
    { href: project.liveUrl, label: "Live", icon: Globe },
    { href: project.docsUrl, label: "Docs", icon: FileText },
    { href: project.designUrl, label: "Design", icon: Palette },
  ];
  const visibleLinks = links.filter((l) => l.href);

  const progress = Math.min(100, Math.max(0, project.progress));

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-5",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
        "focus-within:border-primary/40 focus-within:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            <Link
              href={`/projects/${project.id}`}
              className="outline-none before:absolute before:inset-0 before:rounded-lg focus-visible:before:ring-2 focus-visible:before:ring-ring focus-visible:before:ring-offset-2 focus-visible:before:ring-offset-background"
            >
              {project.title}
            </Link>
          </h3>
          {subtitle ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        <StatusBadge status={project.status} />
      </div>

      {techShown.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {techShown.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {techExtra > 0 ? (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              +{techExtra}
            </span>
          ) : null}
        </div>
      ) : null}

      {tagsShown.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tagsShown.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
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
          {tagsExtra > 0 ? (
            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              +{tagsExtra}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <PriorityDot priority={project.priority} showLabel />
          {dateRange ? (
            <span className="flex items-center gap-1">
              <span aria-hidden className="size-1 rounded-full bg-border" />
              {dateRange}
            </span>
          ) : null}
        </div>
        {visibleLinks.length > 0 ? (
          <div className="relative z-10 flex items-center gap-0.5">
            {visibleLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${label}`}
                title={label}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
            <ExternalLink
              aria-hidden
              className="ml-0.5 size-3 text-border"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function formatDateRange(
  start: Date | null,
  end: Date | null,
): string | null {
  if (!start && !end) return null;
  const fmt = (d: Date) => format(d, "MMM d");
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  if (start) return `Started ${fmt(start)}`;
  return `Due ${fmt(end!)}`;
}
