# Frontend Tests

Playwright snapshot coverage for public pages and Storybook-driven UI.

## Contents
- `e2e/` – public page visual snapshots (Playwright).
- `storybook/` – Storybook iframe snapshots for auth/db-driven components.
- `visual-helpers.ts` – shared determinism helpers (time/theme/fonts/images/animations).

## Notes
- Playwright server reuse is opt-in to avoid accidentally attaching to unrelated local apps.
- Set `PLAYWRIGHT_REUSE_EXISTING_SERVER=1` only when you intentionally want reuse.
