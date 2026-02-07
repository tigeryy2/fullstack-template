import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";

if (
    process.platform === "darwin" &&
    process.arch === "arm64" &&
    !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE
) {
    process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = "mac15-arm64";
}

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [tsconfigPaths()],
    optimizeDeps: {
        include: ["next/navigation", "@vitest/runner"],
    },
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, ".storybook"),
                    }),
                ],
                test: {
                    name: "storybook",
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: "chromium" }],
                    },
                    setupFiles: ["./.storybook/vitest.setup.ts"],
                },
            },
        ],
    },
});
