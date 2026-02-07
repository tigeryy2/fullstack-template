import { expect, test, type Page } from "@playwright/test";
import {
    disableAnimations,
    waitForFonts,
    waitForStorybookRoot,
    waitForText,
    waitForVisibleImages,
} from "../visual-helpers";

type StorySnapshot = {
    name: string;
    storyId: string;
    waitFor?: (page: Page) => Promise<void>;
    screenshotTarget?: "root" | "body";
    screenshotLocator?: string;
    singleShot?: boolean;
    maxDiffPixelRatio?: number;
};

const SNAPSHOTS: StorySnapshot[] = [
    {
        name: "account-summary",
        storyId: "dashboard-accountsummary--default",
        waitFor: waitForText("Account summary"),
    },
];

test.describe("storybook snapshots", () => {
    for (const snapshot of SNAPSHOTS) {
        test(snapshot.name, async ({ page }) => {
            await page.emulateMedia({
                colorScheme: "light",
                reducedMotion: "reduce",
            });
            await page.goto(`/iframe.html?id=${snapshot.storyId}&viewMode=story`, {
                waitUntil: "domcontentloaded",
            });
            await (snapshot.waitFor ?? waitForStorybookRoot)(page);
            await waitForFonts(page);
            await waitForVisibleImages(page, "#storybook-root img");
            await disableAnimations(page);
            await page.evaluate(() => window.scrollTo(0, 0));

            const screenshotTarget = snapshot.screenshotLocator
                ? page.locator(snapshot.screenshotLocator).first()
                : snapshot.screenshotTarget === "body"
                  ? page.locator("body")
                  : page.locator("#storybook-root");
            await screenshotTarget.waitFor();

            if (snapshot.singleShot) {
                const image = await screenshotTarget.screenshot();
                await expect(image).toMatchSnapshot(`${snapshot.name}.png`, {
                    maxDiffPixelRatio: snapshot.maxDiffPixelRatio,
                });
            } else {
                await expect(screenshotTarget).toHaveScreenshot(`${snapshot.name}.png`);
            }
        });
    }
});
