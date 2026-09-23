# PROJECT_STATE.md — SkillForge Persistent State

CURRENT_PHASE: 1 (Security and secrets)
CURRENT_STATUS: PHASE 1 COMPLETE — reviewer PASS; STOP, do not start Phase 2 without explicit instruction
LAST_VERIFIED: 2026-09-23
LAST_COMMIT: (Phase 1 commit) "Phase 1: harden secrets, env handling and credential logging"

---

## Current Phase

Phase 1 — Security and secrets. Harden secret handling, env configuration,
and credential logging. No functional/architectural redesign.

## Current Objective

Per `docs/PRODUCTION_PLAN.md` Phase 1: remove leaked credentials from tracked
files, eliminate insecure secret fallbacks, add `.gitignore` + `.env.example`,
stop plaintext secrets/logging, untrack generated/secret-bearing build output
(without rewriting history). Then STOP and await approval for Phase 2.

## Completed Work (Phase 1)

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

## Current Blockers (recorded from baseline evidence — NOT fixed in Phase 0)

1. Backend source does not build: `src/lib/prisma.ts:3`,
   `src/middleware/auth.ts:4`, `src/routes/auth.ts:7` import
   `../config/config`, which does not exist (`src/config/` has only
   `checkenv.ts`). Verified `tsc --noEmit` TS2307 x3. -> Phase 2.
2. Backend cannot start: `node dist/server.js` fails with
   `@prisma/client did not initialize yet` in the inspected environment; the
   committed `dist/` is stale relative to `src/`. `npm run dev` fails at
   startup on the missing `../config/config`. -> Phase 2.
3. Backend Docker build fails at `RUN npm run build` (same TS2307). -> Phase 10.
4. Frontend typecheck fails: `src/hooks/useOptimizedQuery.ts:32` (TS6133),
   `:85` (TS2352). -> Phase 7.
5. Frontend lint fails: 704 problems; majority are false-positive
   `react/react-in-jsx-scope` under the react-jsx runtime. -> Phase 7.
6. Frontend tests: 2 files failed / 6 tests failed / 9 passed. -> Phase 9.
7. Docker OAuth callback path is not proxied in `nginx.conf` (`/auth/*` falls
   into the SPA `location /`). -> Phase 5 / Phase 10.
8. Production API double prefix `/api/api/*` (Vite `VITE_API_URL=/api` in
   Docker build + services calling `/api/...`). -> Phase 4.
9. Phase 0 security findings — RESOLVED in Phase 1 (reviewer PASS 2026-09-23):
   tracked credential block in `README.md` replaced with placeholders;
   `skillforge-backend/dist/config/config.js` untracked from the index (staged
   deletion, history kept); `.gitignore` + both `.env.example` files created;
   hardcoded `JWT_SECRET` fallback removed with production fail-fast;
   plaintext password path in `src/routes/users.ts` now bcrypt-hashed;
   header/token/credential logging removed (server/middleware/auth/courses/
   checkenv/scripts). Remaining history exposure needs external rotation
   (see Risks). Weak `oauth_state` + unverified state + missing `secure` flag
   intentionally left for Phase 5.

## Verified Commands (Phase 1, actual output — deltas vs Phase 0 baseline)

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

## Files Changed in Current Phase (Phase 1)

New: `.gitignore`, `.env.example`, `skillforge-backend/.env.example`.
Modified: `README.md`, `docker-compose.yml`,
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
  history is NOT rewritten per policy. Local working-tree `dist/` files remain
  on disk (now gitignored) until Phase 2 rebuilds. Weak `oauth_state`
  (`Math.random()`), unverified state, missing `secure` flag, and JWT
  `localStorage` handling intentionally deferred to Phase 5.
- Phase 3: 5 PrismaClient instances; no helmet/rate-limit/body-size;
  no transactions on enroll/progress; duplicate `/health` (`server.ts:123`);
  dead `src/app.ts` and `src/routes/lessonRoutes.js`; Redis declared but unused.
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
  `docker-compose`; compose `version:` obsolete; backend Dockerfile cannot build.
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

Phase 1 gate PASSED (reviewer PASS 2026-09-23). STOP. Await explicit
instruction to begin Phase 2 (Backend build/startup). Do not start Phase 2
automatically.