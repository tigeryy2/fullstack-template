/**
 * Ensure Playwright's Chromium browser is installed for local/dev environments.
 *
 * Skips when:
 *  - npm_config_production === "true"
 *  - NODE_ENV === "production"
 *  - PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1"
 */
const { execSync } = require("node:child_process");

const shouldSkip =
    process.env.npm_config_production === "true" ||
    process.env.NODE_ENV === "production" ||
    process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1";

if (shouldSkip) {
    console.log(
        "[postinstall-playwright] Skipping Playwright browser install (production/skip flag).",
    );
    process.exit(0);
}

try {
    console.log("[postinstall-playwright] Installing Chromium for Playwright...");
    execSync("npx playwright install chromium --with-deps", { stdio: "inherit" });
    console.log("[postinstall-playwright] Chromium installation complete.");
} catch (error) {
    console.error(
        "[postinstall-playwright] Failed to install Chromium via Playwright.",
    );
    console.error(error);
    process.exit(1);
}
