import Link from "next/link";
import type { Priority, ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { PriorityDot } from "@/components/priority-dot";

export type ProjectCardData = {
  id: string;
  title: string;
  tagline: string | null;
  status: ProjectStatus;
  priority: Priority;
  techStack: string[];
  progress: number;
  updatedAt: Date;
};

export type ProjectCardProps = {
  project: ProjectCardData;
  className?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors",
        "hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          {project.tagline ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.tagline}
            </p>
          ) : null}
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 ? (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              +{project.techStack.length - 4}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <PriorityDot priority={project.priority} showLabel />
        <span>Updated {dateFormatter.format(project.updatedAt)}</span>
      </div>
    </Link>
  );
}
