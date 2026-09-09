"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export type SidebarBodyProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onNavigate?: () => void;
};

export function SidebarBody({ user, onNavigate }: SidebarBodyProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-5 pt-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-label="Project Manager, go to dashboard"
          className="inline-flex items-center gap-2.5 rounded-sm"
        >
          <Mark />
          <span className="text-[0.8125rem] font-semibold tracking-tight">
            Project Manager
          </span>
        </Link>
      </div>

      <div className="px-3">
        <Button asChild className="w-full justify-start">
          <Link href="/projects/new" onClick={onNavigate}>
            <Plus />
            New project
          </Link>
        </Button>
      </div>

      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-0.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-[0.8125rem] transition-colors",
                    "before:absolute before:inset-y-1 before:left-[-0.75rem] before:w-[2px] before:rounded-r-sm",
                    active
                      ? "bg-secondary font-medium text-foreground before:bg-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-1 border-t border-border p-3">
        <UserMenu user={user} onNavigate={onNavigate} />
        <ThemeToggle />
      </div>
    </div>
  );
}
