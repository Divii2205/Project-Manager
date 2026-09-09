"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/layout/user-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onNavigate?: () => void;
};

export function UserMenu({ user, onNavigate }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const label = user.name?.trim() || user.email?.split("@")[0] || "Account";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-sm px-1.5 py-1.5 text-left transition-colors",
          "hover:bg-secondary data-[state=open]:bg-secondary",
        )}
      >
        <UserAvatar name={user.name} email={user.email} image={user.image} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] font-medium text-foreground">
            {label}
          </span>
          <span className="block truncate text-[0.6875rem] text-muted-foreground">
            {user.email}
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-56 p-1">
        <div className="border-b border-border px-2 py-2">
          <p className="truncate text-[0.8125rem] font-medium">{label}</p>
          <p className="truncate text-[0.6875rem] text-muted-foreground">
            {user.email}
          </p>
        </div>
        <div className="pt-1">
          <Link
            href="/settings"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="size-4" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ redirectTo: "/login" })}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
