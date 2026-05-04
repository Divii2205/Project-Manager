import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserAvatar } from "@/components/layout/user-avatar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export type HeaderProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-1">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserAvatar
          name={user.name}
          email={user.email}
          image={user.image}
        />
      </div>
    </header>
  );
}
