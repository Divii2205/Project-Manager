import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/toaster";
import { ToastFlasher } from "@/components/toast-flasher";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-60">
        <Header user={session.user} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="animate-rise">{children}</div>
        </main>
      </div>
      <Toaster />
      <Suspense fallback={null}>
        <ToastFlasher />
      </Suspense>
    </div>
  );
}
