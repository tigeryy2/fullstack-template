# Storybook Snapshots

Playwright snapshot coverage targeting Storybook stories for authenticated or data-heavy UI.

## Contents
- `coverage.pw.ts` – Storybook iframe snapshots.

## Notes
- Default mode builds Storybook static and serves it for stable snapshots.
- Use `npm run test:playwright:storybook:dev` for faster local iteration against Storybook dev server.
- `coverage.pw.ts` supports per-story screenshot targets (`root`, `body`, or locator) and optional single-shot diff tuning for animation-heavy stories.
- Use `npm run test-storybook` for Storybook component tests via Vitest browser mode.
- On Apple Silicon, Playwright host platform override is applied automatically by config.
