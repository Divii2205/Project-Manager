import { SidebarBody } from "@/components/layout/sidebar-body";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card md:block">
      <SidebarBody />
    </aside>
  );
}
