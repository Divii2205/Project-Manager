"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const MESSAGES: Record<
  string,
  { kind: "success" | "info"; text: string }
> = {
  created: { kind: "success", text: "Project created" },
  saved: { kind: "success", text: "Changes saved" },
  deleted: { kind: "info", text: "Project moved to trash" },
};

export function ToastFlasher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const flag = searchParams.get("toast");

  useEffect(() => {
    if (!flag) return;
    const message = MESSAGES[flag];
    if (message) {
      if (message.kind === "success") toast.success(message.text);
      else toast.info(message.text);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const next = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  return null;
}
