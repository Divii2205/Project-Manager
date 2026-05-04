"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/layout/sign-out-button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card",
        "md:flex",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Project Manager
        </span>
      </div>

      {/* Quick action */}
      <div className="px-3 pt-4">
        <Button asChild className="w-full justify-start gap-2">
          <Link href="/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <SignOutButton />
      </div>
    </aside>
  );
}
