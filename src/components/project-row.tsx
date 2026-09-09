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

  return (
    <li
      className={cn(
        "group relative transition-colors hover:bg-card focus-within:bg-card",
        className,
      )}
    >
      {/* Status reads down the left edge, so a whole list can be scanned
          without stopping on each badge. The rule also carries the hover
          affordance: white-on-stone is only a few percent of lift, so the
          edge marker thickens to say which line you are on. It spans the
          expanded strip too, because it is positioned against the <li>. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] opacity-70 transition-[width,opacity]",
          "group-hover:w-[5px] group-hover:opacity-100",
          "group-focus-within:w-[5px] group-focus-within:opacity-100",
          meta.fill,
        )}
      />

      {/* `relative` scopes the title link's full-row click overlay to this
          line only, so the revealed detail below stays selectable text
          rather than one big link surface. */}
      <div className="relative flex flex-col gap-3 py-3.5 pl-4 pr-3 lg:flex-row lg:items-center lg:gap-6">
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

          <PriorityMark priority={project.priority} className="shrink-0 lg:w-14" />

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

      {/* The row grows in place rather than opening a panel over the list.
          `grid-template-rows: 0fr -> 1fr` animates to the content's natural
          height, which varies per row — a fixed max-height would clip some
          rows and leave slack under others. Four things this technique needs,
          each of which silently leaves a permanently taller collapsed row if
          missed: exactly one child, `overflow-hidden` on it (that is what
          lets a grid item shrink under its content), no padding on it, and no
          `gap` on the container.

          The delay sits on the hover state only. CSS transitions take their
          timing from the destination state, so settling on a row opens it
          while sweeping past leaves the list still, and collapsing — which
          reads the base state — is instant.

          Pointer-only, like the panel it replaces: below `lg` the row is
          already stacked and showing its subtitle, and `:hover` sticks on
          touch, so a tap on a link icon would leave a row expanded and shift
          the list under the finger.

          aria-hidden: this is a redundant preview of data the row's own title
          link leads to, and it holds nothing focusable. Left in the tree it
          would read the full description, every chip, every tag and four
          dated facts for every row in a view whose whole purpose is
          scanning. Sighted keyboard users still get the reveal via
          group-focus-within. */}
      {hasDetail(project) ? (
        <div
          aria-hidden
          className={cn(
            "hidden grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out lg:grid",
            "lg:group-hover:grid-rows-[1fr] lg:group-hover:delay-200",
            "lg:group-focus-within:grid-rows-[1fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <RowDetail project={project} />
          </div>
        </div>
      ) : null}
    </li>
  );
}

/* Only worth expanding if there is something the row line could not fit. */
function hasDetail(project: ProjectRowData): boolean {
  return Boolean(
    project.description ||
      project.techStack.length > 0 ||
      project.tags.length > 0 ||
      project.startDate ||
      project.targetEndDate,
  );
}

/** The revealed strip: everything the row line had to truncate or drop.
 *  Prose takes the left measure, dated facts align right so the strip
 *  continues the ledger's own column rhythm. */
function RowDetail({ project }: { project: ProjectRowData }) {
  // The row line shows `tagline ?? description` truncated, so show the other
  // one here in full rather than repeating what is already legible above.
  const prose = project.description ?? project.tagline;
  const hasChips = project.techStack.length > 0 || project.tags.length > 0;

  return (
    /* No rule above this: the child is clipped from the bottom, so a top
       border would paint at full opacity in the transition's first frame and
       read as a hairline snapping in — and it would compete with the list's
       own `divide-y`. The card fill and the thickened left rule already
       bracket the region. */
    <div className="pb-4 pl-4 pr-3 pt-0.5">
      <div className="flex flex-col gap-x-6 gap-y-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          {prose ? (
            <p className="line-clamp-3 max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
              {prose}
            </p>
          ) : null}

          {hasChips ? (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              {project.techStack.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground"
                >
                  {item}
                </span>
              ))}

              {/* Separates the two kinds of chip without labelling either. */}
              {project.techStack.length > 0 && project.tags.length > 0 ? (
                <span aria-hidden className="h-3 w-px bg-border" />
              ) : null}

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
          ) : null}
        </div>

        {/* 19.5rem is exactly Links + Priority + Target plus their gaps, so
            right-anchoring at that width lands this column's left edge on the
            Target column above it — the ledger grid continuing downward
            rather than a second grid invented for the strip. */}
        <dl className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 lg:w-[19.5rem]">
          <DetailFact
            label="Started"
            value={project.startDate ? formatDayLong(project.startDate) : null}
          />
          <DetailFact
            label="Target"
            value={
              project.targetEndDate ? formatDayLong(project.targetEndDate) : null
            }
          />
          {project.actualEndDate ? (
            <DetailFact
              label={project.status === "SHIPPED" ? "Shipped" : "Closed"}
              value={formatDayLong(project.actualEndDate)}
            />
          ) : null}
          <DetailFact
            label="Updated"
            value={formatDistanceToNow(project.updatedAt, { addSuffix: true })}
          />
        </dl>
      </div>
    </div>
  );
}

/** Two cells of the parent `dl` grid, not a row of its own — stretching a
 *  label and its value to opposite ends of a wide block reads as a dot
 *  leader without the leaders. */
function DetailFact({ label, value }: { label: string; value: string | null }) {
  return (
    <>
      <dt className="text-xs text-muted-foreground/80">{label}</dt>
      <dd
        className={cn(
          "tabular text-xs",
          value ? "text-foreground" : "text-muted-foreground/50",
        )}
      >
        {value ?? "not set"}
      </dd>
    </>
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
