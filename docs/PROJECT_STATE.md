# PROJECT_STATE.md — SkillForge Persistent State

CURRENT_PHASE: 3 (Backend architecture and hardening)
CURRENT_STATUS: PHASE 3 COMPLETE — reviewer PASS; STOP, do not start Phase 4 without explicit instruction
LAST_VERIFIED: 2026-09-23
LAST_COMMIT: (Phase 3 closure commit) "Harden backend runtime and middleware"

---

## Current Phase

Phase 3 — Backend architecture and hardening. Harden backend runtime behavior
without redesigning APIs, auth, schema, or frontend.

## Current Objective

Per `docs/PRODUCTION_PLAN.md` Phase 3: consolidate PrismaClient to the
`src/lib/prisma.ts` singleton, apply minimal evidenced hardening (headers,
body limit, error/log safety, shutdown), remove verified dead backend files,
dedupe `/health`. Then STOP and await approval for Phase 4.

## Completed Work (Phase 3)

- PrismaClient consolidation (verified, not assumed): live app-level
  `new PrismaClient()` existed in `src/middleware/auth.ts:7`,
  `src/routes/courses.ts:7`, `src/routes/health.ts:5` alongside the singleton
  in `src/lib/prisma.ts`. All three now import the singleton; no query or
  response logic touched. Survivors are justified: `src/scripts/migrate.ts`
  (one-shot script with explicit `$connect`/`$disconnect`), `src/test/setup.ts`
  and `src/routes/__tests__/auth.test.ts` (jest mocks requiring isolation).
  Grep now shows exactly one live app factory (`src/lib/prisma.ts:13`).
- `src/lib/prisma.ts`: query/info logging gated to development; production
  and test run error-only (query logs are verbose and can carry row data).
- `src/server.ts`: `app.disable('x-powered-by')` + dependency-free header
  middleware (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-DNS-Prefetch-Control: off`). No CSP on purpose: `GET /auth/callback`
  serves inline-script HTML (`src/routes/auth.ts`), which a CSP would break;
  CSP belongs to the Phase 5 auth work. No new dependencies added.
- `src/server.ts`: explicit `express.json({ limit: '100kb' })`, locking in the
  previous effective default — zero behavior change (no multer/multipart/
  uploads exist anywhere in backend `src`, so no large-payload path exists).
- `src/server.ts`: removed the unreachable static `GET /health`
  (`{status:'ok'}`) shadowed by the DB-checking `healthRoutes`; removed the
  duplicate `/api` request logger (every `/api/*` request was logged twice);
  reordered catch-all 404 before the error middleware so 404-path errors are
  caught. All route mounts, paths, and response shapes unchanged.
- `src/server.ts`: graceful SIGTERM/SIGINT shutdown — `server.close()` then
  `prisma.$disconnect()`, with a 10s force-exit fallback. No port/config
  changes. Live signal-delivery test not possible in this Windows/PowerShell
  environment; verified by code review + `tsc` + boot.
- Message-only server error logging in `src/routes/courses.ts` (5 sites) and
  `src/routes/health.ts` (1 site), matching the Phase 1 pattern; client-facing
  error responses unchanged and generic.
- Deleted after zero-reference verification (grep + `tsc` exit 0):
  `src/app.ts` (stale second entry; sole `express-session` user; hardcoded
  session secret; unauthenticated mounts), `src/routes/lessonRoutes.js`
  (stale schema `quizzes` vs `quiz`, diverged from live `lessons.ts`),
  `src/scripts/migrate.js` (broken ESM-import-in-CJS duplicate of the
  `package.json`-referenced `migrate.ts`). `express-session` dependency left
  for Phase 11 (no dependency changes in Phase 3).
- Verified no-ops (evidence, no code): CORS correct as-is (exact
  `FRONTEND_URL` origin + `credentials:true`; evil-origin probe returns the
  configured origin, which browsers reject for non-matching origins).
  No transactions added (enroll = single `create` backed by
  `@@unique([userId,courseId])`; progress = single `upsert` on
  `@@unique([userId,lessonId])`). No Redis code (zero prod imports; D-004
  stays open; removal would be Phase 10 Docker scope). No rate limiting
  (no rate-limit dep in stack; custom in-memory limiter would be new unsafe
  global state — documented gap). `server.ts` env-loading vs `config.ts`
  duplication intentionally left (ES-import hoisting vs manual `.env` load
  makes naive migration a behavior risk for local `node dist/server.js`).
- `git diff --check` clean.

## Completed Work (Phase 2)

- Root cause (verified, not assumed): `src/config/config.ts` was never
  committed — `src/config/` held only `checkenv.ts` — while three modules
  import `{ config }` from `../config/config`. The only prior artifact was a
  stale compiled `dist/config/config.js` (untracked in Phase 1).
- Created `skillforge-backend/src/config/config.ts`: env-backed `config`
  object with exactly the keys proven by callers and the old module shape
  (`PORT`, `NODE_ENV`, `FRONTEND_URL`, `JWT_SECRET`, `DATABASE_URL`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`).
  Zero hardcoded secrets; non-secret defaults mirror `src/server.ts`;
  credentials default to `''`; production throws on missing `JWT_SECRET`
  (ADR-001, same rule as `server.ts`); no value logging. No new env vars
  invented (`GOOGLE_CALLBACK_URL` inconsistency left for Phase 5).
- Refreshed Prisma client via the repo's own `npm run prisma:generate`
  (v6.7.0, node_modules output). No schema/generator change.
- `npm run build` now exits 0. `node dist/server.js` boots and stays alive:
  `GET /` → 200 (API doc), `GET /health` → 500 `unhealthy` with no PostgreSQL
  running (graceful DB-down path, allowed: any DB state). `npm run dev` smoke:
  `GET /` → 200. Ephemeral dummy values used in command env only; nothing
  committed; no secrets printed.
- Dockerfile untouched (already `prisma generate` → `npm run build`, no
  bypasses). `docker compose build backend` could not run: Docker Desktop
  engine pipe unavailable in this environment; `docker compose config --quiet`
  still passes. Full container boot deferred to Phase 10 (owns Docker).
- No other files modified. `git diff --check` clean.

## Completed Work (Phase 1 — historical record, reviewer PASS 2026-09-23)

- Created `.gitignore` (ignores `dist/`, `**/dist/`, `.env`/`**/.env`,
  `skillforge-backend/prisma/src/generated/`, `node_modules/`, coverage/logs;
  keeps `!.env.example` tracked).
- Created `.env.example` (root, compose-oriented) and
  `skillforge-backend/.env.example` (backend dev) — placeholders only, using
  only env names proven in `AGENTS.md` §8. No new canonical vars invented.
- `README.md`: replaced the published credential block (Google OAuth
  credential kinds, JWT/session placeholder kinds) with placeholders pointing
  at `.env.example`, plus a rotation warning.
- `skillforge-backend/src/server.ts`: removed hardcoded `JWT_SECRET` fallback;
  production fails fast when `JWT_SECRET` is missing; dev warns without a
  baked-in secret. Startup log is presence-only (`Set`/`Not set`). Debug
  middleware now logs method+URL only (no headers/user objects).
- `skillforge-backend/src/middleware/auth.ts`: removed header/token-fragment/
  decoded-token/user logging; catch logs message text only.
- `skillforge-backend/src/routes/auth.ts`: removed credential-config log,
  callback-param/token-exchange-param/header/token-fragment/decoded/user logs
  and the redirect-URL-with-token log; OAuth catch-all no longer echoes
  internal error text into the redirect URL; remaining errors log message text
  only. No route/flow logic changed.
- `skillforge-backend/src/routes/courses.ts`: removed request-header/user
  logging on `GET /user` (same sensitive-logging class as the Phase 1 set).
- `skillforge-backend/src/routes/users.ts`: `POST /` now hashes the password
  with the existing `bcrypt` dependency (cost 10) and validates required
  fields. Previously stored plaintext.
- `skillforge-backend/src/config/checkenv.ts`,
  `src/scripts/check-env.ts`, `src/scripts/check-oauth-config.ts`,
  `src/scripts/start-auth-test.ts`: presence/structure-only logging (never
  values, no full OAuth URLs, no client-ID prefixes).
- `docker-compose.yml`: removed the insecure `JWT_SECRET` default; empty value
  plus backend fail-fast instead. `POSTGRES_*` dev defaults kept as
  local-dev convenience with an override comment (no compose redesign).
- Untracked via `git rm --cached` (no history rewrite, no force-push):
  `dist/`, `skillforge-backend/dist/` (including the hardcoded-config
  compiled file kind), `skillforge-backend/prisma/src/generated/`. Working-tree
  files remain on disk, now gitignored, until Phase 2 rebuilds.
- Phase 0 control files (`AGENTS.md`, `docs/*`, `.opencode/agents/reviewer.md`)
  committed together with this phase (they were untracked since bootstrap).

## Current Blockers

1. RESOLVED in Phase 2 (reviewer PASS 2026-09-23): backend TS2307 x3 fixed by
   new `src/config/config.ts`; `npm run build` exits 0; `node dist/server.js`
   and `npm run dev` boot and serve `/` (200) with graceful DB-down `/health`.
2. RESOLVED in Phase 2 as far as code is concerned: backend Docker build
   failure was the same TS2307 — `npm run build` now passes and the Dockerfile
   (`prisma generate` → `npm run build`, no bypasses) is valid by inspection;
   image build + container boot could not run here (no Docker engine) and full
   container verification belongs to Phase 10.
3. Frontend typecheck fails: `src/hooks/useOptimizedQuery.ts:32` (TS6133),
   `:85` (TS2352). -> Phase 7.
4. Frontend lint fails: 704 problems; majority are false-positive
   `react/react-in-jsx-scope` under the react-jsx runtime. -> Phase 7.
5. Frontend tests: 2 files failed / 6 tests failed / 9 passed. -> Phase 9.
6. Docker OAuth callback path is not proxied in `nginx.conf` (`/auth/*` falls
   into the SPA `location /`). -> Phase 5 / Phase 10.
7. Production API double prefix `/api/api/*` (Vite `VITE_API_URL=/api` in
   Docker build + services calling `/api/...`). -> Phase 4.
8. Phase 0 security findings — RESOLVED in Phase 1 (reviewer PASS 2026-09-23):
   tracked credential block in `README.md` replaced with placeholders;
   `skillforge-backend/dist/config/config.js` untracked from the index (staged
   deletion, history kept); `.gitignore` + both `.env.example` files created;
   hardcoded `JWT_SECRET` fallback removed with production fail-fast;
   plaintext password path in `src/routes/users.ts` now bcrypt-hashed;
   header/token/credential logging removed (server/middleware/auth/courses/
   checkenv/scripts). Remaining history exposure needs external rotation
   (see Risks). Weak `oauth_state` + unverified state + missing `secure` flag
   intentionally left for Phase 5.

## Verified Commands (Phase 3, actual output)

| Command (workdir) | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.json` (skillforge-backend) | PASS — exit 0 |
| `npm run build` (skillforge-backend) | PASS — exit 0 |
| `npx jest` (skillforge-backend) | PASS — 1 suite, 1 test (placeholder, unchanged) |
| `git grep new PrismaClient` (backend src) | 1 live factory (`lib/prisma.ts:13`) + 3 justified (test mock, one-shot `migrate.ts`, test file) |
| `node dist/server.js` boot (ephemeral test env, :3003/:3004) | stays up; `GET /` → 200; `GET /health` → 500 `unhealthy` (no PostgreSQL — graceful DB-down, same as Phase 2 baseline) |
| security headers on `GET /` | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `X-DNS-Prefetch-Control: off` present; `X-Powered-By` absent |
| CORS probe | allowed origin echoed with credentials; evil origin gets configured origin (browser-rejected for non-matching origin — correct) |
| body limit probe | 200KB `POST /auth/login` rejected before route logic (generic handler message); small POST reaches route handler |
| 404 probe | `GET /no-such-route` → 404 `{error:'Route not found'}` (shape preserved) |
| `git diff --check` | clean (exit 0) |
| Reviewer (`general` subagent per `.opencode/agents/reviewer.md`) | PASS (tsc/build/jest/grep/deletions/contract re-verified by reviewer) |
| SIGTERM/SIGINT delivery | NOT live-tested (Windows/PowerShell cannot deliver POSIX signals); code-reviewed + `tsc`-verified |

## Verified Commands (Phase 2, actual output)

| Command (workdir) | Result |
|---|---|
| `git status --short` | only `?? skillforge-backend/src/config/config.ts` (then this file's own update); `git diff --check` clean |
| `npx tsc --noEmit -p tsconfig.json` (skillforge-backend) | PASS — exit 0 (was FAIL TS2307 x3 in Phase 0/1 baseline) |
| `npm run build` (skillforge-backend) | PASS — exit 0 |
| `npm run prisma:generate` (skillforge-backend) | PASS — Prisma Client v6.7.0 to `node_modules/@prisma/client` (one upstream generator-output-path deprecation warning, untouched — future-phase owned) |
| `npx prisma validate` with `DATABASE_URL` set | PASS — schema valid |
| `node dist/server.js` boot (ephemeral test env, :3001) | process stays alive, Prisma initialized; `GET /` → 200 API-doc JSON; `GET /health` → 500 `unhealthy` (no PostgreSQL running — graceful DB-down path, allowed) |
| `npm run dev` boot smoke (:3002) | `GET /` → 200 |
| `npx jest` (skillforge-backend) | PASS — 1 suite, 1 test (placeholder, unchanged, no test files touched) |
| `docker compose config --quiet` (root) | PASS — only obsolete `version:` warning (unchanged) |
| `docker compose build backend` | NOT RUN — no Docker engine in this environment (client-only connect error); Dockerfile valid by inspection, full image/container verification belongs to Phase 10 |
| secret/value logging check | no `console.*` in new `config.ts`; startup logs presence-only; ephemeral dummy test values in command env only, never committed |
| Reviewer (`general` subagent per `.opencode/agents/reviewer.md`) | PASS (evidence recorded in session; tsc/jest/validate re-verified by reviewer) |

## Verified Commands (Phase 1, actual output — historical record)

| Command (workdir) | Result |
|---|---|
| `git status --short` | `M README.md` + 11 unstaged src/compose files; staged `D` x105 (`dist/`, `skillforge-backend/dist/`, `.../prisma/src/generated/`); `??` only `.gitignore`, `.env.example`, `skillforge-backend/.env.example`, `.opencode/`, `AGENTS.md`, `docs/` (`node_modules` now ignored) |
| `git grep -l -i -E "GOCSPX-|your-secure-jwt-secret|your_jwt_secret"` (tracked) | no matches (GOOD) |
| `git grep -l -E "apps\.googleusercontent\.com"` (tracked) | no matches (GOOD) |
| added-lines-only diff scan for the above kinds | no matches (GOOD) |
| `git grep -n -E "console\.(log\|warn\|error).*(header\|token\|Authorization\|client_id\|client_secret\|GOOGLE_CLIENT)"` (server/middleware/auth/courses/checkenv) | only 3 generic no-value messages (GOOD) |
| `git check-ignore` (`skillforge-backend/dist/...`, `dist/...`, `skillforge-backend/.env`) | all ignored via `.gitignore` (GOOD) |
| `npx tsc --noEmit -p tsconfig.json` (skillforge-backend) | FAIL — same TS2307 `../config/config` x3, exit 2 (unchanged baseline, Phase 2 blocker, acceptable) |
| `npx jest` (skillforge-backend) | PASS — 1 suite, 1 test (placeholder, unchanged) |
| `docker compose config --quiet` (root) | PASS (exit 0) — only obsolete `version:` warning (unchanged) |
| Reviewer (`general` subagent per `.opencode/agents/reviewer.md`) | PASS (evidence recorded in session) |

Phase 0 baseline carried forward (not re-run in Phase 1): frontend
`tsc`/`eslint`/`vitest` failures, `prisma validate` PASS, `npm audit` counts,
`vite build` workbox warning — all unchanged, owned by later phases.
Full Phase 0 baseline table (historical record):

| Command (workdir) | Phase 0 result |
|---|---|
| `git branch --show-current` | main |
| `git log --oneline -10` | `e99fe3d Initial commit...` (single commit) |
| `npx tsc --noEmit -p tsconfig.app.json` (frontend) | FAIL — `useOptimizedQuery.ts:32,85`, exit 1 |
| `npx eslint . --format compact` (frontend) | FAIL — 704 problems |
| `npx vitest run` (frontend) | FAIL — 2 test files / 6 tests failed, 9 passed |
| `npx prisma validate` with `DATABASE_URL` set | PASS — schema valid (exit 0) |

Recorded but not re-run in this session (same environment, prior evidence):
- `npm audit` frontend: 37 vulnerabilities (3 low, 6 moderate, 26 high,
  2 critical). Backend: 22 (4 low, 5 moderate, 11 high, 2 critical). — Phase 11.
- `npx vite build --outDir <temp>` succeeded; workbox warning: precache glob
  (`globDirectory: './dist'` vs actual `outDir: '../dist'`) matched nothing. — Phase 8.
- `node dist/server.js` failed at startup (Prisma not generated). — Phase 2.

## Files Changed in Current Phase (Phase 3)

Modified: `skillforge-backend/src/server.ts` (headers, body limit, `/health`
dedupe, logger dedupe, 404/error reorder, graceful shutdown),
`skillforge-backend/src/lib/prisma.ts` (env-gated log levels),
`skillforge-backend/src/middleware/auth.ts` (singleton import),
`skillforge-backend/src/routes/courses.ts` (singleton import + message-only
logs), `skillforge-backend/src/routes/health.ts` (singleton import +
message-only log). Deleted (all zero-reference verified):
`skillforge-backend/src/app.ts`, `skillforge-backend/src/routes/lessonRoutes.js`,
`skillforge-backend/src/scripts/migrate.js`. Updated: `docs/PROJECT_STATE.md`
(this file). `DECISIONS.md` unchanged (no new architectural decision — D-004
Redis stays open; no CSP by design, recorded above).
No `package.json`, Prisma schema/migration, frontend, compose, or nginx changes.

Phase 2 file record (historical): new
`skillforge-backend/src/config/config.ts` (only implementation file).

Phase 1 file record (historical): new `.gitignore`, `.env.example`,
`skillforge-backend/.env.example`; modified `README.md`, `docker-compose.yml`,
`skillforge-backend/src/server.ts`, `src/middleware/auth.ts`,
`src/routes/auth.ts`, `src/routes/courses.ts`, `src/routes/users.ts`,
`src/config/checkenv.ts`, `src/scripts/check-env.ts`,
`src/scripts/check-oauth-config.ts`, `src/scripts/start-auth-test.ts`,
`docs/PROJECT_STATE.md`, `docs/DECISIONS.md`.
Staged deletions (untracked, history kept): `dist/`,
`skillforge-backend/dist/`, `skillforge-backend/prisma/src/generated/`
(105 files).
Committed Phase 0 control files (were untracked since bootstrap): `AGENTS.md`,
`docs/PRODUCTION_PLAN.md`, `.opencode/agents/reviewer.md` (plus this file).

## Discovered Issues — Future Phases

Recorded for later phases; do not fix early.

- Phase 1 (residual, verified 2026-09-23 — all in-index instances resolved):
  historical credential material remains in git history (`e99fe3d`) and
  requires EXTERNAL rotation (Google OAuth client secret, JWT/session secrets);
  history is NOT rewritten per policy. Working-tree `dist/` was rebuilt from
  source by `npm run build` in Phase 2 (still gitignored). Weak `oauth_state`
  (`Math.random()`), unverified state, missing `secure` flag, and JWT
  `localStorage` handling intentionally deferred to Phase 5.
- Phase 2 (residual): no Docker engine in this environment, so image build +
  container boot are unverified here; Dockerfile is valid by inspection
  (`prisma generate` → `npm run build`, no bypasses). Full container
  verification belongs to Phase 10. Upstream Prisma generator output-path
  deprecation warning left untouched (no schema/generator changes in Phase 2).
- Phase 3 (residual, verified 2026-09-23): PrismaClient consolidated to one
  live factory; dead `src/app.ts`, `src/routes/lessonRoutes.js`,
  `src/scripts/migrate.js` removed; `/health` deduped. Remaining by design:
  no rate limiting (no dep in stack; custom limiter = new unsafe global
  state — gap documented, needs a Phase 11-coordinated dependency decision);
  no CSP (blocked by inline-script OAuth page — Phase 5); Redis declared but
  unused (D-004 open; removal is Phase 10 Docker scope); `server.ts`
  env-loading vs `config.ts` duplication kept (import-hoisting vs `.env`
  load ordering risk); no transactions on enroll/progress (single writes
  backed by `@@unique` constraints — verified sufficient).
- Phase 4: `/api/auth/*` contract exists only in frontend `hooks/useAuth.ts`
  and nginx rewrite; no backend paths; `AuthContext.tsx` PUT `/api/users/profile`
  has no backend route; dev vs prod proxy behavior differs.
- Phase 5: `GOOGLE_REDIRECT_URI` (server/compose) vs `GOOGLE_CALLBACK_URL`
  (docs/scripts/checkenv.ts); OAuth callback redirect vs nginx SPA catch-all;
  README-referenced `/auth/test-google` and `/auth/debug-page` do not exist.
- Phase 6: seed `course.create` (not upsert) can duplicate; no `@@index` on
  `Lesson.order`, `LessonProgress.enrollmentId`; progress math can produce NaN;
  committed generated Prisma client (`.so`/`.dll`) bloats repo.
- Phase 7: frontend type/lint failures; dead components/pages list; `/courses`
  renders lessons; `LessonDetail` gates on token; two theme stores; SDK v5
  `@types/react-router-dom` stub; undeclared `VITE_API_URL`/`VITE_ENABLE_PERFORMANCE_MONITORING`.
- Phase 8: placeholder text PNG icons in `frontend/Dockerfile`; missing
  root `apple-touch-icon.png`/`masked-icon.svg`; manifest screenshots mismatch;
  triple SW registration + two update prompts; empty workbox precache.
- Phase 9: broken/outdated Navbar & Features tests; backend `auth.test.ts` has
  no assertions; jest 70% coverage thresholds unachievable.
- Phase 10: `docker-setup.ps1` references missing `.env.example`; deprecated
  `docker-compose`; compose `version:` obsolete; backend image/container boot
  still unverified (no engine here; code-side build blocker resolved in
  Phase 2).
- Phase 11: `npm audit` findings above; dependency-outdated list recorded in
  prior audit (axios, prisma, vite, vitest, express, etc.) — upgrade only in
  this phase, coordinated.

## Decisions Already Made

See `docs/DECISIONS.md`. Phase 0 recorded evidence-based observations only.
Phase 1 added one security decision: ADR-001 (no hardcoded secret fallbacks;
production fail-fast on missing `JWT_SECRET`).

## Risks

- SECURITY FOLLOW-UP (external action required): credential material from the
  initial commit `e99fe3d` remains in git history by policy (no rewrite in this
  phase). The Google OAuth client secret, JWT secret, and session secret kinds
  previously committed MUST be rotated/revoked in Google Cloud Console and all
  deployment environments. New values must only ever live in environment/
  `.env` (gitignored), never in docs or code.
- Seed `prisma/seed.ts` still contains a weak demo password (dev-only,
  bcrypt-hashed at seed time; seed flow owned by Phase 6) — change before any
  prod-like use.
- Single-commit history means there is no clean-after baseline; git history is
  not to be rewritten.
- Director-level phased work requires discipline: reviewers must confirm phase
  gates before any forward movement.
- Node version in this environment is v22.x while package manifests list
  engines/ranges for older toolchains — verification output reflects the
  inspected environment, not a CI matrix.

## Next Allowed Action

Phase 3 gate PASSED (reviewer PASS 2026-09-23). STOP. Await explicit
instruction to begin Phase 4 (API contract consistency). Do not
start Phase 4 automatically.