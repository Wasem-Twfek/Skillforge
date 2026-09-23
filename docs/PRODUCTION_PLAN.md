# PRODUCTION_PLAN.md — SkillForge Repair Roadmap

Phase order is fixed for safety. Each phase is gated: the next phase may begin
only after this phase's gate passes and a reviewer returns PASS with evidence.
Do not change the order unless a documented blocker proves it impossible.

Legend: **Allowed** = files/categories you may change. **Forbidden** = changes
that belong to a later phase (record instead in PROJECT_STATE.md).

---

## PHASE 0 — Bootstrap (COMPLETE)

- Objective: one-time repository inspection; create the persistence/control system.
- Allowed: `AGENTS.md`, `docs/*`, `.opencode/agents/*` only.
- Forbidden: any application, config, Docker, or dependency change.
- Expected evidence: baseline command results recorded in PROJECT_STATE.md.
- Verification commands: the full gate set (Section 7 of AGENTS.md).
- Definition of done: five control files exist; baseline captured; report issued; STOP.
- Dependencies: none.

PHASE 0 GATE:
- `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/PRODUCTION_PLAN.md`,
  `docs/DECISIONS.md`, `.opencode/agents/reviewer.md` all exist.
- Baseline verification results recorded with real command output.
- No application files modified.

---

## PHASE 1 — Security and secrets

- Objective: remove/rotate leaked credentials, prevent secret fallbacks,
  add `.gitignore` + `.env.example`, stop plaintext secrets/logging, harden
  the one live cookie set. No functional/architectural redesign.
- Allowed: `.gitignore` (new), `.env.example` (new), `src/server.ts`
  (fallback/validation only), `src/config/*` if it exists by then, delete
  hardcoded secret-bearing code paths, debug-logging removal in
  `server.ts`/`middleware/auth.ts`/`routes/auth.ts`, `src/routes/users.ts`
  password handling, remove tracked `dist/`/generated artifacts from the index
  (via `git rm --cached`, never force/history rewrite), `README.md` secret
  block removal.
- Forbidden: OAuth flow redesign (Phase 5), cookie/CSRF strategy (Phase 5),
  API contract changes (Phase 4), dependency changes (Phase 11).
- Expected evidence: no secret values in tracked files; `rg` scans of the
  known secret file list come back clean; rebuild/startup still at the
  recorded Phase-0 state (blockers intentionally unresolved).
- Verification: `git ls-files` scan; secret-pattern `rg` over tracked files
  (report file+kind, never values); `tsc --noEmit` outputs unchanged (still
  failing on the documented Phase-2 blocker is acceptable).
- Definition of done: secrets removed/rotated; env loading fails fast; no new
  commit contains secret material.
- Dependencies: none (Phase 0).

PHASE 1 GATE:
- No tracked file contains hardcoded credentials (grep-verified, values not shown).
- `.gitignore` and `.env.example` exist.
- No secret printed in any command output during the phase.
- Reviewer PASS.

---

## PHASE 2 — Backend build and startup (COMPLETE)

- Objective: make the backend compile and start from `src/`.
- Allowed: create `skillforge-backend/src/config/config.ts` (env-backed,
  zero hardcoded secrets) or remove the `../config/config` imports in
  `src/lib/prisma.ts`, `src/middleware/auth.ts`, `src/routes/auth.ts`; align
  `src/config/checkenv.ts`; fix `tsconfig.json` if it blocks build; ensure
  `npm run dev` and `npm run build` + `node dist/server.js` start.
- Forbidden: auth/OAuth logic (Phase 5), route/contract changes (Phase 4),
  Prisma schema changes (Phase 6), PrismaClient consolidation if it changes
  behavior (Phase 3).
- Expected evidence: `npm run build` succeeds; server boots and `/health` and
  `/` respond (may report DB-down state if no DB is running); Prisma client
  generated as required.
- Verification: `npx tsc --noEmit -p tsconfig.json`; `npm run build`; boot
  test of `node dist/server.js`; `npm run dev` boot test.
- Definition of done: backend builds and starts; documented in PROJECT_STATE.
- Dependencies: Phase 1.

PHASE 2 GATE:
- `npm run build` exits 0.
- Backend starts and serves `/health` and root route (any DB state).
- Reviewer PASS.

---

## PHASE 3 — Backend architecture and hardening (COMPLETE)

- Objective: consolidate PrismaClient to the existing singleton
  (`src/lib/prisma.ts` is the pattern), add minimal hardening the repository
  already implies (helmet-like headers only if already present? — otherwise
  record; rate limiting/body limits only with evidence of need), remove dead
  `src/app.ts`/`src/routes/lessonRoutes.js` after reference check, dedupe
  `/health`, add transactions for enroll/progress only where the two-step
  writes already exist.
- Allowed: `src/lib/prisma.ts`, `src/middleware/auth.ts`, `src/routes/*`,
  `src/app.ts` (delete after proving unused), remove duplicate `/health`.
- Forbidden: Redis feature implementation (no prior usage; if production
  caching is required it must be decided first in DECISIONS.md), new
  libraries, dependency changes (Phase 11).
- Expected evidence: single PrismaClient instantiation point; routes behave as
  before (no contract change); Redis decision documented if still unused.
- Verification: `npm run build`; `npm test` (jest); boot smoke test.
- Definition of done: one PrismaClient; no dead app entry; existing tests pass.
- Dependencies: Phase 2.

PHASE 3 GATE:
- Build green; jest suite green (or no regression vs Phase 0 baseline, with
  the no-assertion defect recorded for Phase 9).
- Grep confirms one live PrismaClient factory.
- Reviewer PASS.

---

## PHASE 4 — API contract consistency (COMPLETE)

- Objective: make frontend service calls match backend routes exactly, in dev
  and prod, without inventing endpoints.
- Allowed: frontend `src/lib/axios.ts`, `src/services/*`, `src/contexts/AuthContext.tsx`
  URL/path alignment; backend route prefixes if an existing route proves the
  correct contract; Vite dev proxy mapping if evidence shows a mismatch.
- Forbidden: new endpoints that do not exist in backend evidence; field/type
  changes beyond what existing code already implies (leave response-shape
  drift for Phase 7 if it is frontend-only).
- Expected evidence: every frontend-callable path maps to an existing backend
  route in both dev and proxied prod prefixes; the `/api/api` double-prefix
  resolved using an existing convention (e.g., nginx proxying `/api`).
- Verification: route inventory (grep of `app.use`/`router.<method>` vs
  frontend service paths); typecheck; manual smoke of the proxied path.
- Definition of done: contract matrix documented in PROJECT_STATE; no
  frontend call targets a nonexistent route.
- Dependencies: Phase 2 (backend must run to validate).

PHASE 4 GATE:
- Contract matrix in PROJECT_STATE.md; all frontend paths resolve.
- Frontend `tsc --noEmit` still records only the documented Phase-7 residual
  (field-drift items deferred) or better.
- Reviewer PASS.

---

## PHASE 5 — Authentication and OAuth

- Objective: stabilize email + Google OAuth flows using only existing
  endpoints/behavior. Unify the redirect-URI env variable name
  (`GOOGLE_REDIRECT_URI` wins as the server/compose-set name — verify repos
  usage first), implement real CSRF state handling using existing cookie
  support, align callback routing (frontend `/auth/callback`, backend
  `/auth/google/callback`, nginx).
- Allowed: `src/routes/auth.ts`, `src/config/*`, `src/scripts/check-*.ts`,
  `.env.example`, `nginx.conf` (auth-path proxying), `README.md` (OAuth section)
  — but only the OAuth/CSRF/session mechanics, not unrelated docs.
- Forbidden: JWT-library swaps or token-storage redesign unless a security
  blocker (Phase 1 record) requires it — then decide first in DECISIONS.md;
  `express-session` activation without a decision.
- Expected evidence: state set + verified in callback; redirect URIs consistent;
  login/register/signup and `/auth/me` behave; Google flow reachable through
  the proxied path in the documented topology.
- Verification: unit/jest for state flow if feasible with existing test setup;
  manual OAuth smoke blocked by missing real credentials in env — document.
- Definition of done: CSRF state verified; env var names unified; docs align.
- Dependencies: Phase 4 (contract), Phase 1 (secret removal first).

PHASE 5 GATE:
- State cookie is generated with a CSPRNG and compared in the callback.
- A single redirect-URI env name is used by code, scripts, compose, docs.
- Reviewer PASS.

---

## PHASE 6 — Database and Prisma

- Objective: validate schema/migrations/seed against a clean PostgreSQL;
  initialize a clean DB from scratch; make seed idempotent if repo evidence
  shows a running seed duplicates rows; add missing `@@index` only where
  existing queries prove need.
- Allowed: `prisma/schema.prisma`, new migration (only if schema changes are
  justified by evidence), `prisma/seed.ts` (upsert pattern already used for
  instructor), `src/scripts/migrate.*`, `fix-prisma.ps1`, `test-env.js` audit.
- Forbidden: model/field inventions; changing `directUrl` semantics without a
  decision; dependency upgrades (Phase 11).
- Expected evidence: `npx prisma migrate deploy` on a fresh container DB;
  `npm run prisma:seed` runnable twice without duplicates (if evidence shows
  the current seed is non-idempotent).
- Verification: `npx prisma validate`; dockerized Postgres init + migrate +
  seed; `docker compose config --quiet`.
- Definition of done: clean-DB-from-scratch documented steps that run.
- Dependencies: Phase 2, Phase 10 (DB availability) — coordinate.

PHASE 6 GATE:
- Fresh database initializes via migrations + seed in one documented command set.
- `prisma validate` green.
- Reviewer PASS.

---

## PHASE 7 — Frontend correctness and integration

- Objective: fix all frontend type errors, lint blockers that are real (while
  fixing the config so `react/react-in-jsx-scope` no longer produces false
  positives), broken imports, dead links/routes, and integrate the existing
  course/lesson UI that is wired to nothing, using existing components.
- Allowed: `frontend/src/**`, `frontend/.eslintrc.cjs`, `frontend/vite.config.ts`
  (proxy/alias only), `frontend/tsconfig*.json`, unused-code removal only
  after reference check.
- Forbidden: PWA changes (Phase 8), test rewrites (Phase 9), dependency
  changes (Phase 11), API-path changes (Phase 4 already done).
- Expected evidence: `tsc --noEmit` green for app+node configs; `eslint .`
  green (or documented exempt list); dead-file removal list with proof each is
  unreferenced.
- Verification: `npx tsc --noEmit -p tsconfig.app.json`; `tsconfig.node.json`;
  `npx eslint .`; `npx vitest run` still at Phase-0 result (tests deferred).
- Definition of done: frontend typechecks and lints clean; no broken import.
- Dependencies: Phase 4 (contract), Phase 5 (auth context).

PHASE 7 GATE:
- Both `tsc --noEmit` configs exit 0.
- `eslint .` exits 0.
- Reviewer PASS.

---

## PHASE 8 — PWA

- Objective: fix PWA config and assets using existing `vite-plugin-pwa`
  configuration: real icons (keep the sharp-based generator already in
  `scripts/`), correct `globDirectory` for precache, single SW registration +
  single update UI, fix manifest assets/screenshots.
- Allowed: `frontend/vite.config.ts` (PWA plugin block), `frontend/src/main.tsx`,
  `frontend/src/pwa/registerSW.ts`, `frontend/src/components/PWAUpdatePrompt.tsx`,
  `frontend/index.html`, `frontend/public/**`, `frontend/Dockerfile` (icon step,
  after Phase 10 defers build-behavior changes: coordinate), `scripts/*`.
- Forbidden: dependency upgrades (Phase 11); changing offline-detection
  features beyond existing files.
- Expected evidence: `vite build` produces a `sw.js` with non-empty precache
  matching the real outDir; valid PNG icons; one registered SW.
- Verification: `npx vite build` to a temp outDir and inspect SW/precache +
  icons; Lighthouse not required.
- Definition of done: precache non-empty; icons are valid PNGs; one registration.
- Dependencies: Phase 7.

PHASE 8 GATE:
- Build output shows a populated precache manifest (no "glob didn't match" warning).
- Exactly one SW registration path remains.
- Reviewer PASS.

---

## PHASE 9 — Testing

- Objective: repair broken/outdated tests so they reflect current components;
  give backend `auth.test.ts` real assertions against existing code; set
  coverage thresholds to a level the suite can actually meet.
- Allowed: `frontend/src/**/*.test.*`, `frontend/vitest.config.ts`,
  `skillforge-backend/src/**/*.test.*`, `skillforge-backend/jest.config.js`,
  `src/test/setup.ts`.
- Forbidden: changing application code to make tests pass; fake tests.
- Expected evidence: `npx vitest run` green; `npx jest` green with real
  assertions; coverage % reported (frontend via `npm run test:coverage`).
- Verification: full test suite both sides.
- Definition of done: all tests pass; coverage reported; thresholds truthful.
- Dependencies: Phase 7 (components stable).

PHASE 9 GATE:
- Vitest: 0 failing tests. Jest: 0 failing, non-trivial assertions.
- Reviewer PASS.

---

## PHASE 10 — Docker and Nginx

- Objective: reliable containerized deployment: backend image builds; Prisma
  generate/migrate behavior correct; frontend image builds with real icons and
  does not skip type-checking; Nginx proxies API + auth + OAuth callback;
  `docker-setup.ps1` updated to current `docker compose`; compose `version:`
  removed; healthchecks/networking verified.
- Allowed: `docker-compose.yml`, `frontend/Dockerfile`,
  `skillforge-backend/Dockerfile`, `nginx.conf`, `docker-setup.ps1`,
  `.dockerignore` files.
- Forbidden: dependency version changes (Phase 11); moving secret handling
  here (Phase 1 governs env loading).
- Expected evidence: `docker compose build` succeeds for both images; `docker
  compose up -d` brings postgres+redis+backend+frontend healthy; SPA, API, and
  auth callback paths respond through Nginx.
- Verification: `docker compose config --quiet`; `docker compose build`;
  `docker compose ps`; curl smoke of `/`, `/health`, `/api/courses`,
  `/auth/google/callback` through :80.
- Definition of done: full stack healthy; no build-time error-skipping.
- Dependencies: Phase 2 (backend build), Phase 4, Phase 5, Phase 8, Phase 6.

PHASE 10 GATE:
- Both images build with their real build steps (no sed/skip tricks).
- Compose stack healthy; API+auth+callback routed through Nginx.
- Reviewer PASS.

---

## PHASE 11 — Dependency/security maintenance

- Objective: address `npm audit` findings and outdated packages within the
  majors already in use, coordinating backend/frontend together; never
  `npm audit fix --force`.
- Allowed: both `package.json`/lockfiles, but only releases consistent with
  the majors the code targets (vite 5, vitest 0.34 -> record whether moving
  majors is required and decide in DECISIONS.md first).
- Forbidden: uncoordinated major upgrades that break phases 0-10 results
  without a documented decision and re-verification.
- Expected evidence: post-upgrade audit counts lower; full gate set green.
- Verification: `npm audit` both apps; `npm run build` both; test suites; docker
  build if deps affect images.
- Definition of done: no unresolved critical/high that a same-major release fixes.
- Dependencies: everything prior (deps lock in stability).

PHASE 11 GATE:
- Audit summary recorded; every remaining finding has a recorded disposition.
- Full verification set green after changes.
- Reviewer PASS.

---

## PHASE 12 — End-to-end validation

- Objective: run the complete application as deployed: fresh DB init, backend
  + frontend up, auth flows, course/lesson/progress/quiz paths, PWA install
  surface, through Nginx.
- Allowed: verification scripts under `scripts/` only if needed to automate.
- Forbidden: functional changes; only fixes for defects discovered by the
  validation that map to an already-scoped phase (fix in that phase's scope or
  record as blocker).
- Expected evidence: documented E2E script results: register/login/me,
  courses list/detail/enroll/progress, lessons, quizzes, auth callback, health.
- Verification: full gate set + E2E checklist.
- Definition of done: E2E checklist green or each failure has a recorded,
  phased disposition.
- Dependencies: Phase 10, Phase 11.

PHASE 12 GATE:
- E2E checklist fully green or individually dispositioned.
- Reviewer PASS.

---

## PHASE 13 — Final production hardening and release review

- Objective: release review: docs accurate, control files current, no open
  criticals, final audit summary, production-readiness statement scoped to
  verified behavior only.
- Allowed: documentation only, plus fixes for release-blocking defects.
- Forbidden: new features.
- Expected evidence: README matches code; PROJECT_STATE reflects full history;
  final verification record.
- Verification: full gate set one final time.
- Definition of done: release review document; readiness claim restricted to
  what was actually verified.

PHASE 13 GATE:
- Final gate set green; known-limitations section written; reviewer PASS.
- ONLY after this phase may "production ready for the tested environment" be claimed.