# Project Manager — CLAUDE.md

A multi-tenant SaaS project management tool. Web-first, mobile later. Think "Notion meets Linear" focused on project lifecycle tracking: ideation → execution, status, team collab, dashboards, timelines, links, notes, tags.

This file is the source of truth for stack, architecture, and the reasoning behind each decision. When something here goes stale, update it.

---

## Final stack

| Layer | Choice | Notes |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Turborepo added when build times start to matter, not before |
| Backend | NestJS 11 + Prisma + PostgreSQL 15 | Redis added later for queues/cache/sessions |
| Web frontend | Next.js 15 (App Router) + TypeScript | Replaces the current Vite+React scaffold |
| UI | Tailwind CSS + shadcn/ui | Owned components, no UI-library lock-in |
| Data fetching | TanStack Query + (RSC + Server Actions where it fits) | Avoid client state libs until needed |
| Auth | Clerk (default) OR better-auth (if self-hosted required) | Decision deferred to first auth task — see "Open decisions" |
| Mobile | Expo (React Native), separate app — deferred to v2 | PWA covers most PM-tool needs initially |
| Shared code | `packages/shared` (zod schemas, DTOs, domain types) | Consumed by both `apps/api` and `apps/web` |
| Validation | zod (shared) + class-validator (Nest DTOs derived from zod where possible) | Single source of truth for shapes |
| Container | Docker Compose for local Postgres (already set up) | Add Redis service when introduced |

---

## Target repo structure

```
/apps
  /api          NestJS — moved from ./backend
  /web          Next.js — replaces ./frontend
  /mobile       Expo — added in v2
/packages
  /shared       zod schemas, shared TS types, domain enums
  /api-client   typed client (optional — generate from OpenAPI or hand-roll)
  /config       shared eslint/tsconfig/prettier base configs (optional)
/docker-compose.yml
/turbo.json
/pnpm-workspace.yaml
```

The current `backend/` and `frontend/` will be moved into `apps/`. This is part of the initial migration (see "Migration steps" below).

---

## Architecture decisions

### Multi-tenancy: row-level, single database, single schema
Every tenant-scoped table carries `workspaceId` (or `orgId` — name TBD with auth choice). Enforcement is two layers:

1. **Prisma extension** that injects `workspaceId` into every query for tenant-scoped models, derived from request context (AsyncLocalStorage or Nest `RequestContext`).
2. **Nest guard** (`WorkspaceGuard`) that resolves the active workspace from the auth token / URL param and validates membership.

**Why:** schema-per-tenant and DB-per-tenant are operationally painful at our scale (migrations × N tenants, connection pool exhaustion). Row-level is the industry default for SaaS at <10k tenants and stays simple. Postgres RLS is an optional belt-and-braces layer we can add later without changing app code.

### Backend: NestJS + Prisma
- NestJS modules map cleanly to product domains (`auth`, `workspaces`, `projects`, `tasks`, `comments`, `notifications`).
- Guards/interceptors are the right primitive for cross-cutting concerns (tenant scoping, audit logging, rate limiting).
- Prisma + Postgres: best type-safe ORM in JS, great migrations, JSONB available when we need flexibility (e.g., custom fields on projects).

### Frontend: Next.js 15 (App Router), not React Native Web
- Web-first product → optimal web experience matters.
- App Router gives RSC, Server Actions, edge rendering — useful for marketing pages, dashboards, and reducing client bundle.
- React Native Web was rejected because: weaker web ergonomics (StyleSheet vs CSS), Metro slower than Vite/Next, smaller component ecosystem, worse SEO/a11y for marketing-style pages.
- Mobile, when we get to it, will be a separate Expo app sharing **types + API client + domain logic** via `packages/shared` — not UI components. UI rarely shares cleanly across mobile/web because UX patterns differ.

### Database: PostgreSQL
- Relational + JSONB covers everything a PM tool needs.
- Universal cloud support, mature operational story, RLS available.
- Redis added later for: BullMQ job queues (notifications, webhooks), session cache, rate-limit counters. Not now.

### Auth: Clerk OR better-auth (decision deferred)
- **Clerk** if we prioritize speed and are okay paying — built-in orgs, invitations, MFA, social login, webhook → workspace creation flow.
- **better-auth** if self-hosting is a hard requirement — more wiring, no cost, full control.
- **Not** rolling our own JWT/refresh-token system — too easy to get multi-tenancy edge cases wrong.

### Monorepo, not split repos
- Shared types between FE/BE catch breaking changes at compile time.
- Atomic PRs across stack.
- One CI pipeline, one dependency upgrade pass.
- Can always split later. Splitting now = artificial pain.

### Validation: zod as the source of truth
- Define request/response shapes as zod schemas in `packages/shared`.
- Nest derives DTOs from zod (via `nestjs-zod` or similar) → no duplicate validation.
- Web consumes the same schemas for forms (`react-hook-form` + `@hookform/resolvers/zod`).

---

## Conventions

- **Package manager:** pnpm only. No `npm install` or `yarn`.
- **Node:** pin via `.nvmrc` / `engines` once we settle on a version (likely 22 LTS).
- **Env:** every app has a `.env.example`. Real `.env` is gitignored. Server-side env vars validated with zod at boot — fail fast if misconfigured.
- **Imports:** absolute imports via tsconfig paths (`@/...`) within an app; cross-package imports via the workspace name (`@project-manager/shared`).
- **Migrations:** Prisma migrations only. Never edit the DB schema by hand.
- **Branching:** `main` is protected. Feature branches → PR → squash merge.

---

## Open decisions (track here, resolve as we go)

- [ ] Auth provider: Clerk vs better-auth — decide before first auth feature.
- [ ] Workspace vocabulary: `workspace` vs `org` vs `team` — pick one, be consistent in DB + UI.
- [ ] Email provider (transactional): Resend vs Postmark vs SES.
- [ ] Hosting: Vercel (web) + Railway/Fly/Render (api+db) vs all-in on one provider.
- [ ] Observability: Sentry only vs Sentry + OpenTelemetry stack.

---

## What this file is not

- Not a task list — use issues / PR descriptions for that.
- Not a tutorial — assumes the reader knows the named tools.
- Not exhaustive — reflects decisions we've actually made, not everything we could decide.
