import type { ReactNode } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Github, Globe, Palette } from "lucide-react";
import type { Priority, ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { STATUS_META, isClosed } from "@/lib/lifecycle";
import { daysUntil, describeDue, formatDay, formatDayLong } from "@/lib/dates";
import { StatusBadge } from "@/components/status-badge";
import { PriorityMark } from "@/components/priority-mark";
import { ProgressMeter } from "@/components/progress-meter";
import { RowHover } from "@/components/row-hover";

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
  techStack: string[];
  startDate: Date | null;
  targetEndDate: Date | null;
  actualEndDate: Date | null;
  updatedAt: Date;
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

  const body = (
    <div className="flex flex-col gap-3 py-3.5 pl-4 pr-3 data-[state=open]:bg-card lg:flex-row lg:items-center lg:gap-6">
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
  );

  return (
    <li
      className={cn(
        "group relative transition-colors hover:bg-card",
        "focus-within:bg-card",
        className,
      )}
    >
      {/* Status reads down the left edge, so a whole list can be scanned
          without stopping on each badge. The rule also carries the hover
          affordance: white-on-stone is only a few percent of lift, so the
          edge marker thickens to say which line you are on. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] opacity-70 transition-[width,opacity]",
          "group-hover:w-[5px] group-hover:opacity-100",
          "group-focus-within:w-[5px] group-focus-within:opacity-100",
          // Stays thickened while the preview panel is open, even once the
          // pointer has moved off the row and onto the panel.
          "group-has-[[data-state=open]]:w-[5px] group-has-[[data-state=open]]:opacity-100",
          meta.fill,
        )}
      />

      {hasPreview(project) ? (
        <RowHover trigger={body}>
          <RowPreview project={project} />
        </RowHover>
      ) : (
        body
      )}
    </li>
  );
}

/* Only worth opening a panel if it has something the row could not fit. */
function hasPreview(project: ProjectRowData): boolean {
  return Boolean(
    project.description ||
      project.techStack.length > 0 ||
      project.tags.length > 0 ||
      project.startDate ||
      project.targetEndDate,
  );
}

/** The hover panel: everything the row had to truncate or drop. */
function RowPreview({ project }: { project: ProjectRowData }) {
  const words = project.tagline ?? project.description;

  return (
    /* Sibling-driven rules: each section after the first is separated by a
       hairline, so an absent section never leaves a rule dangling. */
    <div className="text-[0.8125rem] [&>*+*]:mt-3 [&>*+*]:border-t [&>*+*]:border-border [&>*+*]:pt-3">
      {words ? (
        <div className="space-y-1.5">
          {project.tagline ? (
            <p className="text-sm font-medium leading-snug tracking-tight text-foreground">
              {project.tagline}
            </p>
          ) : null}
          {project.description ? (
            <p className="line-clamp-5 leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          ) : null}
        </div>
      ) : null}

      {project.techStack.length > 0 ? (
        <PreviewBlock label="Tech stack">
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((item) => (
              <span
                key={item}
                className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </PreviewBlock>
      ) : null}

      {project.tags.length > 0 ? (
        <PreviewBlock label="Tags">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground"
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
        </PreviewBlock>
      ) : null}

      <dl className="space-y-1">
        <PreviewFact
          label="Started"
          value={project.startDate ? formatDayLong(project.startDate) : null}
        />
        <PreviewFact
          label="Target"
          value={
            project.targetEndDate ? formatDayLong(project.targetEndDate) : null
          }
        />
        {project.actualEndDate ? (
          <PreviewFact
            label={project.status === "SHIPPED" ? "Shipped" : "Closed"}
            value={formatDayLong(project.actualEndDate)}
          />
        ) : null}
        <PreviewFact
          label="Updated"
          value={formatDistanceToNow(project.updatedAt, { addSuffix: true })}
        />
      </dl>
    </div>
  );
}

function PreviewBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-muted-foreground/80">{label}</p>
      {children}
    </div>
  );
}

function PreviewFact({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-muted-foreground/80">{label}</dt>
      <dd
        className={cn(
          "tabular text-xs",
          value ? "text-foreground" : "text-muted-foreground/50",
        )}
      >
        {value ?? "not set"}
      </dd>
    </div>
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
