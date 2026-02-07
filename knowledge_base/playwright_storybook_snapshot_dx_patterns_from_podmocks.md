---
last_read: 2026-02-07T00:00:00Z
usefulness: 5
read_win_tags:
  - frontend
  - playwright
  - storybook
  - dx
---

# Playwright + Storybook Snapshot DX Patterns (from podmocks)

Patterns copied because they reduced snapshot flake and made story additions faster:

## Snapshot Spec Shape
- Define snapshots as typed data (`name`, `storyId`, optional `waitFor`).
- Add optional capture controls per snapshot:
  - `screenshotTarget`: `"root"` or `"body"`
  - `screenshotLocator`: custom locator for focused captures
  - `singleShot` + `maxDiffPixelRatio` for animation-heavy stories

## Determinism
- Freeze time (`Date` override) for page-level snapshots.
- Force light theme via localStorage and `emulateMedia`.
- Disable animations/transitions before capture.
- Wait for fonts and visible images in Storybook before screenshotting.
- Use a fallback `waitForStorybookRoot` when no explicit wait step is provided.

## Config + Workflow
- Keep Storybook snapshots on a dedicated Playwright config.
- Default to static Storybook builds for stability.
- Support fast local iteration with `PLAYWRIGHT_STORYBOOK_MODE=dev`.
- Use explicit npm scripts for static and dev snapshot modes.

## Migration Gotchas
- If migrating from Storybook 8 webpack to Storybook 10 Vite, pin Storybook package versions to the same minor (for example `10.1.2`) to avoid addon/runtime mismatches.
- For Playwright on Apple Silicon in some shells, set `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac15-arm64` when browser binary resolution incorrectly targets `mac-x64`.
