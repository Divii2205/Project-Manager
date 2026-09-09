import type { Priority, ProjectStatus } from "@prisma/client";

/* One source of truth for how a project's lifecycle is named and coloured.
   Labels used to be redeclared in the badge, the filter bar, and the form,
   which is how they drifted apart. Class strings are written out in full so
   Tailwind can see them. */

/** The path a project actually travels, in order. */
export const STATUS_PATH = [
  "IDEA",
  "PLANNING",
  "IN_PROGRESS",
  "SHIPPED",
] as const satisfies readonly ProjectStatus[];

/** States that interrupt the path rather than advance along it. */
export const STATUS_OFF_PATH = [
  "PAUSED",
  "ABANDONED",
] as const satisfies readonly ProjectStatus[];

export const STATUS_ORDER = [
  ...STATUS_PATH,
  ...STATUS_OFF_PATH,
] as const satisfies readonly ProjectStatus[];

export type StatusMeta = {
  label: string;
  /** Tinted chip: faint fill, ink-coloured text. */
  chip: string;
  /** Solid fill, for lifecycle bars and the row rule. */
  fill: string;
  text: string;
};

export const STATUS_META: Record<ProjectStatus, StatusMeta> = {
  IDEA: {
    label: "Idea",
    chip: "bg-status-idea/[0.12] text-status-idea",
    fill: "bg-status-idea",
    text: "text-status-idea",
  },
  PLANNING: {
    label: "Planning",
    chip: "bg-status-planning/[0.12] text-status-planning",
    fill: "bg-status-planning",
    text: "text-status-planning",
  },
  IN_PROGRESS: {
    label: "In progress",
    chip: "bg-status-progress/[0.12] text-status-progress",
    fill: "bg-status-progress",
    text: "text-status-progress",
  },
  SHIPPED: {
    label: "Shipped",
    chip: "bg-status-shipped/[0.12] text-status-shipped",
    fill: "bg-status-shipped",
    text: "text-status-shipped",
  },
  PAUSED: {
    label: "Paused",
    chip: "bg-status-paused/[0.12] text-status-paused",
    fill: "bg-status-paused",
    text: "text-status-paused",
  },
  ABANDONED: {
    label: "Abandoned",
    chip: "bg-status-abandoned/[0.12] text-status-abandoned",
    fill: "bg-status-abandoned",
    text: "text-status-abandoned",
  },
};

export const PRIORITY_ORDER = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const satisfies readonly Priority[];

export type PriorityMeta = {
  label: string;
  /** 1–4: how many segments of the priority mark are filled. */
  level: number;
  fill: string;
  text: string;
};

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  LOW: {
    label: "Low",
    level: 1,
    fill: "bg-priority-low",
    text: "text-priority-low",
  },
  MEDIUM: {
    label: "Medium",
    level: 2,
    fill: "bg-priority-medium",
    text: "text-priority-medium",
  },
  HIGH: {
    label: "High",
    level: 3,
    fill: "bg-priority-high",
    text: "text-priority-high",
  },
  CRITICAL: {
    label: "Critical",
    level: 4,
    fill: "bg-priority-critical",
    text: "text-priority-critical",
  },
};

export function statusLabel(status: ProjectStatus): string {
  return STATUS_META[status].label;
}

export function priorityLabel(priority: Priority): string {
  return PRIORITY_META[priority].label;
}

/** Shipped and abandoned projects are closed — no deadline applies to them. */
export function isClosed(status: ProjectStatus): boolean {
  return status === "SHIPPED" || status === "ABANDONED";
}
