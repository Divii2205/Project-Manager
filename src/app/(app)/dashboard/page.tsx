import Link from "next/link";
import {
  CalendarClock,
  CircleDashed,
  FolderKanban,
  Plus,
  Rocket,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBreakdown } from "@/components/dashboard/status-breakdown";
import {
  getDashboardStats,
  getRecentProjects,
  requireUserId,
} from "@/lib/projects";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [stats, recent] = await Promise.all([
    getDashboardStats(userId),
    getRecentProjects(userId, 6),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your project portfolio at a glance."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        }
      />

      {stats.total === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Start tracking your first project"
          description="Capture an idea, plan it, ship it — all in one place."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="size-4" />
                New project
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FolderKanban}
              label="Total projects"
              value={stats.total}
            />
            <StatCard
              icon={CircleDashed}
              label="In progress"
              value={stats.inProgress}
            />
            <StatCard
              icon={Rocket}
              label="Shipped"
              value={stats.shipped}
              accent="emerald"
            />
            <StatCard
              icon={CalendarClock}
              label="Due in 14 days"
              value={stats.upcomingDeadlines}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="text-base font-semibold tracking-tight">
                  Recently updated
                </h2>
                <Link
                  href="/projects"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {recent.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={{
                      id: p.id,
                      title: p.title,
                      tagline: p.tagline,
                      description: p.description,
                      status: p.status,
                      priority: p.priority,
                      techStack: p.techStack,
                      progress: p.progress,
                      startDate: p.startDate,
                      targetEndDate: p.targetEndDate,
                      githubUrl: p.githubUrl,
                      liveUrl: p.liveUrl,
                      designUrl: p.designUrl,
                      docsUrl: p.docsUrl,
                      tags: p.projectTags.map((pt) => ({
                        id: pt.tag.id,
                        name: pt.tag.name,
                        color: pt.tag.color,
                      })),
                      updatedAt: p.updatedAt,
                    }}
                  />
                ))}
              </div>
            </section>

            <StatusBreakdown byStatus={stats.byStatus} />
          </div>
        </>
      )}
    </div>
  );
}
