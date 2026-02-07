import { defineConfig, devices } from "@playwright/test";

if (
    process.platform === "darwin" &&
    process.arch === "arm64" &&
    !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE
) {
    process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = "mac15-arm64";
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const shouldStartServer = !process.env.PLAYWRIGHT_BASE_URL;
const reuseExistingServer =
    process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1" && !process.env.CI;

export default defineConfig({
    testDir: "./tests/e2e",
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
              command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
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
        {
            name: "iphone-13",
            use: {
                ...devices["iPhone 13"],
            },
        },
    ],
});
