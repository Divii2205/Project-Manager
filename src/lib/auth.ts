import { cache } from "react";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    updateAge: 60 * 60 * 24, // refresh expiry at most once per day
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Single-user app: it's our own email across providers, so let Auth.js
      // attach a Google account to the existing user row instead of throwing
      // OAuthAccountNotLinked.
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

// Per-request memoized session. Layout, generateMetadata, and the page all
// need the session within a single render — without this, each call is a
// separate Session+User round-trip to Neon. React cache() dedupes them so the
// query runs once per request.
export const getSession = cache(() => auth());
