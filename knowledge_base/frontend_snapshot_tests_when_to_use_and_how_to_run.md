---
last_read: 2026-02-07T00:00:00Z
usefulness: 5
read_win_tags:
  - frontend
  - testing
  - snapshots
  - playbook
---

# Frontend Snapshot Tests: When To Use and How To Run

Use this guide to pick the right snapshot workflow and run it quickly.

## When To Use Each Snapshot Type

- Use page snapshots (`frontend/tests/e2e/*.pw.ts`) for public routes and full-page regressions.
- Use Storybook snapshots (`frontend/tests/storybook/*.pw.ts`) for isolated components, especially authenticated or data-heavy UI.
- Use one-off screenshots for local debugging only; do not commit them as regression baselines.

## Quick Decision Rules

- If the UI change is on a route (`/`, `/pricing`, `/docs`), run page snapshots.
- If the UI change is a reusable component or state variant, run Storybook snapshots.
- If both a page and shared component changed, run both suites.

## Prerequisites

- Install frontend dependencies:

```bash
npm -C frontend install
```

- Optional: run against an existing app/storybook server by setting `PLAYWRIGHT_BASE_URL`.
- Optional: for page snapshots, disable mocks with `PLAYWRIGHT_USE_MOCKS=false` when validating live backend behavior.

## Run Commands

### Public Page Snapshots

```bash
npm -C frontend run test:playwright
```

Update baselines when visual changes are intentional:

```bash
npm -C frontend run test:playwright:update
```

### Storybook Component Snapshots (Stable/CI Mode)

```bash
npm -C frontend run test:playwright:storybook
```

Update baselines:

```bash
npm -C frontend run test:playwright:storybook:update
```

### Storybook Component Snapshots (Fast Local Iteration)

```bash
npm -C frontend run test:playwright:storybook:dev
```

Update baselines in dev mode:

```bash
npm -C frontend run test:playwright:storybook:dev:update
```

## After Running

- Review diffs in snapshot folders before committing:
  - `frontend/tests/e2e/visual.pw.ts-snapshots/`
  - `frontend/tests/storybook/coverage.pw.ts-snapshots/`
- Commit baseline changes only when they match intended UI updates.
- If snapshots fail unexpectedly, rerun once after clearing local app state and confirming deterministic settings (time, theme, motion) are unchanged.
