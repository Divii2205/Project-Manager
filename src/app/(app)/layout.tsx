import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/toaster";
import { ToastFlasher } from "@/components/toast-flasher";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <MobileNav user={user} />
      <div className="md:pl-60">
        <main className="mx-auto max-w-content px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </main>
      </div>
      <Toaster />
      <Suspense fallback={null}>
        <ToastFlasher />
      </Suspense>
    </div>
  );
}
