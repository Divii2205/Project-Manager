// Shared types — populated as the app grows.

import type { ProjectStatus, Priority } from "@prisma/client";

export type { ProjectStatus, Priority };

// Re-export Auth.js v5 module augmentation hook for downstream extensions.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
