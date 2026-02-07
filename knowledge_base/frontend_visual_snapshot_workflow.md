---
last_read: 2026-02-07T00:00:00Z
usefulness: 5
read_win_tags:
  - frontend
  - testing
  - snapshots
---

# Frontend Visual Snapshot Workflow

Use Playwright to capture page-level snapshots for public routes, and Storybook snapshots for authenticated or data-backed UI.

## One-Off Screenshots
- Store ad-hoc captures under `/temp/` (gitignored).
- Example: `npx playwright screenshot <url> <path>`.

## Public Page Snapshots (Playwright)
- Spec: `frontend/tests/e2e/visual.pw.ts`
- Baselines: `frontend/tests/e2e/visual.pw.ts-snapshots/`
- Run: `npm -C frontend run test:playwright`
- Update baselines: `npm -C frontend run test:playwright:update`

## Auth/DB UI Snapshots (Storybook + Playwright)
- Storybook specs: `frontend/tests/storybook/*.pw.ts`
- Playwright config: `frontend/playwright.storybook.config.ts`
- Run: `npm -C frontend run test:playwright:storybook`
- Update baselines: `npm -C frontend run test:playwright:storybook:update`
- Default mode builds Storybook static + serves via `python3 -m http.server`.
- Dev-mode shortcuts:
  - `npm -C frontend run test:playwright:storybook:dev`
  - `npm -C frontend run test:playwright:storybook:dev:update`

## Notes on Determinism
- Freezes time by overriding `Date`.
- Forces light mode via localStorage + `emulateMedia`.
- Disables animations/transitions.
- Waits for fonts before snapshot.
- Waits for visible Storybook images before snapshot.
- On Apple Silicon, config auto-sets `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac15-arm64`.

## Mocks vs Live Data
- Mocks are enabled by default for Playwright snapshot tests.
- Disable mocks with `PLAYWRIGHT_USE_MOCKS=false`.
