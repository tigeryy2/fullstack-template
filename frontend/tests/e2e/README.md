# E2E Snapshots

Playwright visual snapshots for public, non-authenticated pages.

## Contents
- `visual.pw.ts` – snapshot coverage for public routes.
- `visual.pw.ts-snapshots/` – generated baselines (commit after review).

## Notes
- Mocks are enabled by default for deterministic snapshots.
- Set `PLAYWRIGHT_USE_MOCKS=false` to run snapshots against live backend responses.
