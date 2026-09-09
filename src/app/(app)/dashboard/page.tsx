import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { LifecycleSpine } from "@/components/lifecycle-spine";
import { ProjectRow, ProjectRowHeader } from "@/components/project-row";
import { cn } from "@/lib/utils";
import {
  getDashboardStats,
  getProjectsNeedingAttention,
  getRecentProjects,
  requireUserId,
  toProjectRow,
  type ProjectWithTags,
} from "@/lib/projects";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [stats, attention, recent] = await Promise.all([
    getDashboardStats(userId),
    getProjectsNeedingAttention(userId, 5),
    getRecentProjects(userId, 6),
  ]);

  if (stats.total === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" />
        <EmptyState
          title="Nothing tracked yet"
          description="Add the first project and this page will show where everything you are building currently stands."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus />
                New project
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus />
              New project
            </Link>
          </Button>
        }
      />

      <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-4">
        <Figure label="tracked" value={stats.total} />
        <Figure label="in progress" value={stats.inProgress} />
        <Figure label="shipped" value={stats.shipped} />
        <Figure
          label="due in 14 days"
          value={stats.upcomingDeadlines}
          tone={stats.upcomingDeadlines > 0 ? "signal" : "quiet"}
        />
        <Figure
          label="overdue"
          value={stats.overdue}
          tone={stats.overdue > 0 ? "alert" : "quiet"}
        />
      </dl>

      <section className="space-y-6">
        <h2 className="text-[0.9375rem] font-semibold tracking-tight">
          Where everything stands
        </h2>
        <LifecycleSpine byStatus={stats.byStatus} />
      </section>

      {attention.length > 0 ? (
        <Ledger
          title="Needs attention"
          caption="Open projects with a target date that has passed or is close."
          projects={attention}
        />
      ) : null}

      <Ledger
        title="Recently updated"
        href="/projects"
        linkLabel="All projects"
        projects={recent}
      />
    </div>
  );
}

function Figure({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "signal" | "alert" | "quiet";
}) {
  return (
    <div className="flex flex-col-reverse gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "tabular text-2xl font-semibold leading-none tracking-tighter",
          tone === "signal" && "text-signal",
          tone === "alert" && "text-destructive",
          tone === "quiet" && "text-muted-foreground/60",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Ledger({
  title,
  caption,
  href,
  linkLabel,
  projects,
}: {
  title: string;
  caption?: string;
  href?: string;
  linkLabel?: string;
  projects: ProjectWithTags[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[0.9375rem] font-semibold tracking-tight">
            {title}
          </h2>
          {caption ? (
            <p className="text-[0.8125rem] text-muted-foreground">{caption}</p>
          ) : null}
        </div>
        {href && linkLabel ? (
          <Link
            href={href}
            className="shrink-0 text-xs font-medium text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
      <div>
        <ProjectRowHeader />
        <ul className="divide-y divide-border border-b border-border">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={toProjectRow(p)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
