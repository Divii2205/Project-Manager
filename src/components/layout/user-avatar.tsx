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

/** The one round thing in the interface. */
export function UserAvatar({ name, email, image, className }: UserAvatarProps) {
  const base = cn(
    "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full",
    "bg-secondary text-[0.625rem] font-semibold text-muted-foreground",
    "ring-1 ring-inset ring-border",
    className,
  );

  if (image) {
    return (
      <span className={base}>
        <Image
          src={image}
          alt=""
          width={56}
          height={56}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span className={base} aria-hidden>
      {initials(name, email)}
    </span>
  );
}
