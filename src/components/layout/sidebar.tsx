import { SidebarBody, type SidebarBodyProps } from "@/components/layout/sidebar-body";

export function Sidebar({ user }: Pick<SidebarBodyProps, "user">) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border md:block">
      <SidebarBody user={user} />
    </aside>
  );
}
