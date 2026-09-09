"use client";

import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";

import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SidebarBody, type SidebarBodyProps } from "@/components/layout/sidebar-body";

/** The mobile-only top bar. On desktop the sidebar carries everything, so
 *  there is no header bar to keep an empty row of chrome alive. */
export function MobileNav({ user }: Pick<SidebarBodyProps, "user">) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur md:hidden">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
            <Menu />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Move between the dashboard, your projects, and settings.
            </Dialog.Description>
            <SidebarBody user={user} onNavigate={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Link
        href="/dashboard"
        aria-label="Project Manager, go to dashboard"
        className="flex items-center gap-2 rounded-sm"
      >
        <Mark className="size-5" />
        <span className="text-[0.8125rem] font-semibold tracking-tight">
          Project Manager
        </span>
      </Link>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
