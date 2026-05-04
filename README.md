# Project Manager

Track your personal projects from idea to shipped — a calm, premium dashboard for everything you build.

> _Screenshot coming soon._

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/Neon-Postgres-00E599?style=flat&logo=postgresql&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-7F2EFF?style=flat)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)

## Features

- **Project lifecycle tracking** — idea → planning → in-progress → shipped (or paused / abandoned)
- **Rich detail per project** — tagline, description, tech stack, dates, priority, links (GitHub, live, design, docs), tags, manual progress %
- **Rich-text notes** — Tiptap editor with clickable links for capturing ideas and future improvements
- **Dashboard** — totals, status breakdown, recently updated, upcoming deadlines
- **Filterable project list** — by status, priority, tags; sortable by date, priority, last updated
- **Search** across all projects
- **Light + dark modes** — light by default, smooth toggle
- **Mobile-friendly + PWA-installable** — use it on your phone like a native app
- **Sign in with Google** or **email magic link**

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 14 (App Router, TypeScript strict) |
| Database | Neon serverless Postgres |
| ORM | Prisma 5 |
| Auth | Auth.js v5 (Google OAuth + Resend magic link) |
| UI | Tailwind CSS + shadcn/ui |
| Rich text | Tiptap (StarterKit + Link) |
| Forms | React Hook Form + Zod |
| Icons | Lucide |
| Theming | next-themes |
| Hosting | Vercel |

## Getting started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm i -g pnpm`)
- A **Neon** project (free tier works) — get the connection string
- A **Google Cloud** OAuth 2.0 client (for Google sign-in)
- A **Resend** API key (for magic-link email)

### Clone and install

```bash
git clone <your-repo-url>
cd "Project Manager"
pnpm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill in the values (see the env table below). Generate a strong `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Push the schema

```bash
pnpm db:push      # syncs schema → Neon (no migration history)
# or
pnpm db:migrate   # creates a versioned migration
```

### Run locally

```bash
pnpm dev
```

App runs on http://localhost:3000.

## Environment variables

| Name | Description |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string (`postgres://...?sslmode=require`) |
| `AUTH_SECRET` | Random 32+ byte secret for Auth.js session encryption |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_RESEND_KEY` | Resend API key (`re_…`) |
| `EMAIL_FROM` | From-address for magic-link emails (e.g. `Project Manager <noreply@yourdomain.com>`) |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app (defaults to `http://localhost:3000`) |

## Deployment (Vercel)

1. Push your repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add every variable from the table above to the Vercel project's **Environment Variables**.
4. In your Google OAuth client, add the Vercel production URL to authorized redirect URIs:
   `https://your-domain.vercel.app/api/auth/callback/google`.
5. In Resend, verify your sending domain and update `EMAIL_FROM` accordingly.
6. Trigger a deploy — Vercel runs `pnpm build` automatically.

The app expects `DATABASE_URL` to be reachable from Vercel; Neon serverless URLs work out of the box (no IP allowlist needed).

## Scripts

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint         # next lint
pnpm typecheck    # tsc --noEmit

pnpm db:generate  # regenerate Prisma client
pnpm db:push      # sync schema to DB without migrations
pnpm db:migrate   # create + run a migration
pnpm db:studio    # open Prisma Studio
```

## License

MIT
