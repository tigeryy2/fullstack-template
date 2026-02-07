import { expect, test, type Page } from "@playwright/test";
import {
    disableAnimations,
    freezeTime,
    seedLightTheme,
    waitForFonts,
} from "../visual-helpers";

const USE_MOCKS = process.env.PLAYWRIGHT_USE_MOCKS !== "false";
const FROZEN_TIME_MS = new Date("2025-01-01T12:00:00.000Z").getTime();

type SnapshotTarget = {
    name: string;
    path: string;
    waitFor: (page: Page) => Promise<void>;
};

const SNAPSHOTS: SnapshotTarget[] = [
    {
        name: "home",
        path: "/",
        waitFor: async (page) => {
            await page.getByText("Get started by editing").waitFor();
        },
    },
];

async function installMocks(page: Page) {
    if (!USE_MOCKS) return;

    await page.route("**/api/auth/session", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: "null",
        });
    });
}

test.describe("visual snapshots", () => {
    test.beforeEach(async ({ page }) => {
        await freezeTime(page, FROZEN_TIME_MS);
        await seedLightTheme(page);
        await page.emulateMedia({ colorScheme: "light" });
    });

    for (const snapshot of SNAPSHOTS) {
        test(snapshot.name, async ({ page }) => {
            await installMocks(page);
            await page.goto(snapshot.path, { waitUntil: "domcontentloaded" });
            await snapshot.waitFor(page);
            await waitForFonts(page);
            await disableAnimations(page);
            await page.evaluate(() => window.scrollTo(0, 0));

            await expect(page).toHaveScreenshot(`${snapshot.name}.png`, {
                fullPage: true,
            });
        });
    }
});
