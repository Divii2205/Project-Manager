import Image from "next/image";

import { cn } from "@/lib/utils";

export type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  className?: string;
};

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+|[@.]/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || source[0]!.toUpperCase();
}

export function UserAvatar({ name, email, image, className }: UserAvatarProps) {
  const baseClasses = cn(
    "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-medium text-foreground ring-1 ring-inset ring-border",
    className,
  );

  if (image) {
    return (
      <span className={baseClasses}>
        <Image
          src={image}
          alt={name ?? email ?? "User avatar"}
          width={32}
          height={32}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return <span className={baseClasses}>{initials(name, email)}</span>;
}
