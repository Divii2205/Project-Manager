"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/layout/sign-out-button";

export type SidebarBodyProps = {
  onNavigate?: () => void;
};

export function SidebarBody({ onNavigate }: SidebarBodyProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Project Manager
        </span>
      </div>

      <div className="px-3 pt-4">
        <Button asChild className="w-full justify-start gap-2">
          <Link href="/projects/new" onClick={onNavigate}>
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

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
                  onClick={onNavigate}
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

      <div className="border-t border-border p-3">
        <SignOutButton />
      </div>
    </div>
  );
}
