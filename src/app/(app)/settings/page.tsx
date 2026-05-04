import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { ProfileSection } from "@/components/settings/profile-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { AppearanceSection } from "@/components/settings/appearance-section";
import { DangerZone } from "@/components/settings/danger-zone";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/projects";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      image: true,
      notifyDeadlines: true,
    },
  });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Profile, notifications, theme, and account."
      />

      <ProfileSection
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
      />
      <NotificationsSection initialEnabled={user.notifyDeadlines} />
      <AppearanceSection />
      <DangerZone />
    </div>
  );
}
