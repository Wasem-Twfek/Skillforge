# DECISIONS.md — SkillForge Architecture Decision Log

Only decisions supported by the existing repository or explicitly decided
during the project belong here. During Phase 0 no new decisions were made;
this file records observed, evidence-backed conventions so future changes
stay aligned with the repository.

## Observed Conventions (evidence-backed, recorded during Phase 0)

- **Repo/tooling root**: git worktree root is `skillforge/` (branch `main`,
  single commit `e99fe3d`). No `.gitignore` exists.
- **Frontend SPA on Vite** (`frontend/package.json`, `frontend/vite.config.ts`):
  React 18, React Router 6, TanStack Query 5, Zustand 5, axios, Tailwind 3,
  `vite-plugin-pwa` (generateSW, prompt). Dev server on :3000 with `/api` and
  `/auth` proxied to `http://localhost:3001`.
- **Backend on Express + Prisma** (`skillforge-backend/package.json`,
  `src/server.ts`): routes mounted at `/`, `/health`, `/auth`, `/api/courses`,
  `/api/users`, `/api/lessons`, `/api/quizzes`; JWT auth via `authenticate`
  middleware; Prisma singleton pattern in `src/lib/prisma.ts`.
- **Docker topology** (`docker-compose.yml`, `nginx.conf`): Nginx serves the
  SPA and proxies `^/(api|health)` and rewrites `/api/auth/*` to `/auth/*`;
  backend command runs `prisma generate && prisma migrate deploy`; frontend
  build sets `VITE_API_URL=/api`.
- **Environment handling**: `DOCKER=true` skips dotenv; otherwise dev loads
  `skillforge-backend/.env`. Env names in use today include `PORT`,
  `NODE_ENV`, `FRONTEND_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `DATABASE_URL`, `REDIS_URL`,
  `POSTGRES_*`, `VITE_API_URL`. A `GOOGLE_CALLBACK_URL` name also appears in
  scripts/docs — the naming decision is deferred to Phase 5.
- **Frontend token storage**: JWT kept in `localStorage` and attached via an
  axios request interceptor (observed; security treatment deferred to
  Phase 1/5 decisions).

## Open decision items (will be decided and recorded before implementation)

| # | Topic | Phase | Status |
|---|---|---|---|
| D-001 | Redirect-URI env var name: unify `GOOGLE_REDIRECT_URI` vs `GOOGLE_CALLBACK_URL` | 5 | decided (`GOOGLE_REDIRECT_URI`; Phase 5 renamed all `GOOGLE_CALLBACK_URL` uses) |
| D-002 | OAuth CSRF state strategy (CSPRNG + verified cookie) | 5 | decided (ADR-003) |
| D-003 | JWT/token storage strategy if Phase 1 evidence requires change | 1/5 | decided (ADR-004: keep `localStorage`) |
| D-004 | Redis: keep declared-but-unused, use it, or remove from compose/docs | 3 | open |
| D-005 | `/api/auth/*` prefix convention (nginx rewrite vs backend-mounted routes) | 4 | decided (ADR-002) |
| D-006 | Frontend/backend response-shape alignment for lessons/quizzes | 4/7 | open |
| D-007 | Dependency major-upgrade policy (vite/vitest/prisma/express majors) | 11 | open |
| D-008 | Seed idempotency approach (upsert pattern exists for instructor) | 6 | decided (ADR-005) |

## ADR format (use for every decision made during the project)

## ADR-001 (2026-09-23) — No hardcoded secret fallbacks; fail fast in production
Status: Accepted
Context: Phase 0 proved the backend ran with hardcoded credential defaults
(`src/server.ts` JWT fallback; compose `JWT_SECRET` default; hardcoded values
in tracked `skillforge-backend/dist/config/config.js`) and published credential
kinds in `README.md`, so production could silently run on dev secrets.
Decision: Production secrets come only from environment/configuration. The
server throws at startup when `JWT_SECRET` is missing under
`NODE_ENV=production` (warns otherwise); compose provides no `JWT_SECRET`
default; `.env.example` files carry placeholders only; build output and
generated Prisma clients stay untracked via `.gitignore`.
Consequences: Deploys without `JWT_SECRET` fail loudly instead of running
insecure; local dev must copy `.env.example` to `.env`. Previously committed
credential material is treated as compromised and must be rotated externally;
history is not rewritten.
Evidence: `skillforge-backend/src/server.ts`, `docker-compose.yml`,
`.gitignore`, `.env.example`, `skillforge-backend/.env.example`,
`docs/PROJECT_STATE.md` Phase 1 verification (tracked secret-kind scans clean;
reviewer PASS).

## ADR-002 (2026-09-23) — `/api/auth/*` is the canonical frontend-facing auth prefix
Status: Accepted
Context: Phase 4 proved the frontend calls auth exclusively as `/api/auth/*`
(`AuthContext.tsx`, `hooks/useAuth.ts`, `Signup.tsx`) while the backend
mounted only `/auth`, relying on the nginx `/api/auth/*` → `/auth/*` rewrite
in production. That left development (Vite proxy has no rewrite) and any
direct-backend access serving 404 for the same paths the frontend calls.
Decision: The backend serves the existing auth router under both `/auth` and
`/api/auth` (`skillforge-backend/src/server.ts`); the nginx rewrite is kept
for compatibility; the Vite dev proxy rewrites `^/api/auth/` → `/auth/`
(`frontend/vite.config.ts`), mirroring nginx. Frontend auth calls use relative
`/api/auth/*` paths. No route logic differs between the mounts.
Consequences: Auth paths resolve identically in dev, prod, and direct-backend
access; D-005 closed. OAuth/CSRF mechanics unchanged (Phase 5).
Evidence: `skillforge-backend/src/server.ts` dual mount, `nginx.conf`
rewrite block, `frontend/vite.config.ts` proxy rewrite,
`frontend/src/contexts/AuthContext.tsx` relative paths, Phase 4 boot probes
(`GET /api/auth/me` → auth-router 401, `POST /api/auth/login` → handler).

## ADR-003 (2026-09-23) — Cookie-based OAuth CSRF state, no new store
Status: Accepted
Context: Phase 5 proved `GET /auth/google` generated `state` with
`Math.random()` and never verified it in `/google/callback`, leaving the
Google OAuth flow open to login-CSRF. The backend has no cookie parser,
no session store, and no Redis usage; adding a store would be new
infrastructure for a single value.
Decision: Generate state with `crypto.randomBytes(32)` (hex), store it in
the existing `oauth_state` cookie (`httpOnly`, `sameSite: 'lax'`,
`secure` in production, 10-minute expiry), parse the `Cookie` header
without a new dependency, compare with `crypto.timingSafeEqual` (fail
closed), and clear the cookie on consumption for single-use. Missing or
mismatched state redirects with `invalid_state` before any code exchange.
Consequences: CSRF protection without sessions, Redis, or new
dependencies; `Secure` relies on localhost-as-secure-context for prod
`http://localhost` deployments (dev unaffected — flag is prod-only).
Evidence: `skillforge-backend/src/lib/oauthState.ts`,
`skillforge-backend/src/routes/auth.ts` (`/google`, `/google/callback`),
Phase 5 state CASE A–C probes and jest suite.

## ADR-004 (2026-09-23) — Keep JWT in browser `localStorage`
Status: Accepted
Context: Phase 5 evaluated moving access tokens out of `localStorage`
(frontend axios interceptor, `AuthContext`, `/auth/callback` page all
write it). A cookie-based session would require backend set-cookie +
CORS `credentials` rework + frontend auth rewrite + its own CSRF
protection — an architecture redesign the Phase 5 scope forbids without
a security blocker, and no exfiltrated-token incident is evidenced.
Decision: Keep `localStorage` JWT handling; instead remove the
demonstrated theft vector (unescaped token interpolation in
`GET /auth/callback`, now escaped) and keep tokens out of all logs.
Consequences: XSS impact stays at the `localStorage` baseline;
revisit only with evidenced need in a dedicated auth phase.
Evidence: `frontend/src/lib/axios.ts`, `frontend/src/contexts/AuthContext.tsx`,
`skillforge-backend/src/routes/auth.ts` (`/callback` escaping), Phase 1/5
no-secret-output verification.

## ADR-005 (2026-09-24) — Seed idempotency via lookup guards; FK lookup indexes via forward migration
Status: Accepted
Context: Phase 6 proved `prisma/seed.ts` used unconditional `course.create`
plus three unconditional `lesson.create` calls, so every re-run duplicated
the demo course and its lessons (only the instructor used `upsert`). Phase 6
also proved `Lesson.courseId` and `LessonProgress.enrollmentId` are filtered/
joined by real queries (`GET /api/courses/:id/lessons`, lesson counts, and
`Enrollment include progress`) while the migration history contained no
matching indexes (PostgreSQL does not auto-index FK columns).
Decision: Seed reuses instead of duplicating — `course.findFirst`
(`instructorId` + `title`; `Course` has no unique field to upsert on) and
lesson creation guarded by `lesson.count == 0` for the course. Schema gains
exactly `Lesson @@index([courseId])` and `LessonProgress
@@index([enrollmentId])`, applied as a normal forward migration
(`20260924000000_add_lookup_indexes`, two `CREATE INDEX` statements, no
DROP/ALTER). No model/field additions: frontend-only aspirational fields
(`rating/students/price/tags/duration/resources`) stay out of the schema
(D-006 remains open for Phase 7). No transactions added: enroll is a single
`create` backed by `@@unique([userId,courseId])`, progress a single atomic
`upsert` on `@@unique([userId,lessonId])`.
Consequences: `npm run prisma:seed` is re-runnable without duplicates
(sequential use); fresh databases get the lookup indexes through
`prisma migrate deploy`. D-008 closed.
Evidence: `skillforge-backend/prisma/seed.ts`,
`skillforge-backend/prisma/schema.prisma`,
`skillforge-backend/prisma/migrations/20260924000000_add_lookup_indexes/migration.sql`,
`skillforge-backend/src/routes/courses.ts` (query evidence), Phase 6
verification (`prisma validate`, `generate`, `tsc`, `jest`, reviewer PASS).

When a decision is made, append an entry:

```
## ADR-#### (Date) — <Title>
Status: Accepted | Superseded
Context: (evidence from the repository that motivates this decision)
Decision: (what was decided)
Consequences: (what this enables / what it requires not doing)
Evidence: (files/commands that prove the decision is consistent)
```