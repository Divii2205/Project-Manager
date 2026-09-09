import Link from "next/link";
import { FileText, Github, Globe, Palette } from "lucide-react";
import type { Priority, ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { STATUS_META, isClosed } from "@/lib/lifecycle";
import { daysUntil, describeDue, formatDay } from "@/lib/dates";
import { StatusBadge } from "@/components/status-badge";
import { PriorityMark } from "@/components/priority-mark";
import { ProgressMeter } from "@/components/progress-meter";

export type ProjectRowTag = {
  id: string;
  name: string;
  color: string;
};

export type ProjectRowData = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  targetEndDate: Date | null;
  actualEndDate: Date | null;
  githubUrl: string | null;
  liveUrl: string | null;
  designUrl: string | null;
  docsUrl: string | null;
  tags: ProjectRowTag[];
};

const LINKS = [
  { key: "githubUrl", label: "GitHub", icon: Github },
  { key: "liveUrl", label: "Live site", icon: Globe },
  { key: "docsUrl", label: "Docs", icon: FileText },
  { key: "designUrl", label: "Design", icon: Palette },
] as const;

/** Column labels for the ledger. Rendered once, above the rows. */
export function ProjectRowHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden items-center gap-6 border-b border-border px-4 pb-2 text-xs text-muted-foreground/80 lg:flex",
        className,
      )}
      aria-hidden
    >
      <span className="min-w-0 flex-1">Project</span>
      <span className="w-[6.5rem] shrink-0">Stage</span>
      <span className="w-24 shrink-0">Progress</span>
      <span className="w-[7.5rem] shrink-0">Target</span>
      <span className="w-14 shrink-0">Priority</span>
      <span className="w-[5.5rem] shrink-0 text-right">Links</span>
    </div>
  );
}

export type ProjectRowProps = {
  project: ProjectRowData;
  className?: string;
};

export function ProjectRow({ project, className }: ProjectRowProps) {
  const meta = STATUS_META[project.status];
  const subtitle = project.tagline ?? project.description ?? null;
  const links = LINKS.filter((l) => project[l.key]);
  const due = describeTarget(project);

  return (
    <li
      className={cn(
        "group relative transition-colors hover:bg-card",
        "focus-within:bg-card",
        className,
      )}
    >
      {/* Status reads down the left edge, so a whole list can be scanned
          without stopping on each badge. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] opacity-70 transition-opacity group-hover:opacity-100",
          meta.fill,
        )}
      />

      <div className="flex flex-col gap-3 py-3.5 pl-4 pr-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
              <Link
                href={`/projects/${project.id}`}
                className="rounded-sm before:absolute before:inset-0"
              >
                {project.title}
              </Link>
            </h3>
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-sm"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </span>
            ))}
            {project.tags.length > 2 ? (
              <span className="text-[0.6875rem] text-muted-foreground/70">
                +{project.tags.length - 2}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusBadge
            status={project.status}
            tone="inline"
            className="lg:w-[6.5rem]"
          />

          <div className="flex w-24 shrink-0 items-center gap-2">
            <ProgressMeter
              value={project.progress}
              ariaLabel={`${project.title} progress`}
              className="flex-1"
            />
            <span className="tabular w-8 shrink-0 text-right text-xs text-muted-foreground">
              {project.progress}%
            </span>
          </div>

          <span
            className={cn(
              "tabular shrink-0 text-xs lg:w-[7.5rem]",
              due.tone === "overdue" && "font-medium text-destructive",
              due.tone === "soon" && "font-medium text-signal",
              due.tone === "normal" && "text-muted-foreground",
              due.tone === "none" && "text-muted-foreground/50",
            )}
          >
            {due.text}
          </span>

          <PriorityMark
            priority={project.priority}
            className="shrink-0 lg:w-14"
          />

          <div className="relative z-10 flex w-[5.5rem] shrink-0 items-center justify-start gap-0.5 lg:justify-end">
            {links.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={project[key] as string}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} for ${project.title}`}
                title={label}
                className="flex size-7 items-center justify-center rounded-sm text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

type Target = { text: string; tone: "overdue" | "soon" | "normal" | "none" };

function describeTarget(project: ProjectRowData): Target {
  if (isClosed(project.status)) {
    if (project.actualEndDate) {
      return {
        text: `${project.status === "SHIPPED" ? "shipped" : "closed"} ${formatDay(project.actualEndDate)}`,
        tone: "normal",
      };
    }
    return { text: "closed", tone: "none" };
  }

  if (!project.targetEndDate) return { text: "no target", tone: "none" };

  const days = daysUntil(project.targetEndDate);
  return {
    text: describeDue(project.targetEndDate),
    tone: days < 0 ? "overdue" : days <= 7 ? "soon" : "normal",
  };
}
