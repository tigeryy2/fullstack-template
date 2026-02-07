import { defineConfig, devices } from "@playwright/test";

if (
    process.platform === "darwin" &&
    process.arch === "arm64" &&
    !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE
) {
    process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = "mac15-arm64";
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:6006";
const shouldStartServer = !process.env.PLAYWRIGHT_BASE_URL;
const reuseExistingServer =
    process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1" && !process.env.CI;
const storybookMode = process.env.PLAYWRIGHT_STORYBOOK_MODE ?? "static";
const webServerCommand =
    storybookMode === "dev"
        ? "npm run storybook -- --ci"
        : "npm run build-storybook -- --output-dir storybook-static && python3 -m http.server 6006 --directory storybook-static";

export default defineConfig({
    testDir: "./tests/storybook",
    testMatch: "**/*.pw.ts",
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL,
        locale: "en-US",
        timezoneId: "UTC",
        contextOptions: {
            reducedMotion: "reduce",
        },
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    webServer: shouldStartServer
        ? {
              command: webServerCommand,
              url: baseURL,
              reuseExistingServer,
              timeout: 120_000,
          }
        : undefined,
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 900 },
            },
        },
    ],
});
