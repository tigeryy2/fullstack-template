import type { Page } from "@playwright/test";

type DateConstructorArgs =
    | []
    | [value: number | string | Date]
    | [
          year: number,
          month: number,
          date?: number,
          hours?: number,
          minutes?: number,
          seconds?: number,
          ms?: number,
      ];

export async function freezeTime(page: Page, frozenTimeMs: number) {
    await page.addInitScript((timestamp) => {
        const OriginalDate = Date;

        class MockDate extends OriginalDate {
            constructor(...args: DateConstructorArgs) {
                if (args.length === 0) {
                    super(timestamp);
                } else {
                    super(...(args as ConstructorParameters<typeof Date>));
                }
            }

            static now() {
                return timestamp;
            }
        }

        MockDate.UTC = OriginalDate.UTC;
        MockDate.parse = OriginalDate.parse;
        // @ts-expect-error Playwright init script overrides Date for deterministic snapshots.
        window.Date = MockDate;
    }, frozenTimeMs);
}

export async function seedLightTheme(page: Page) {
    await page.addInitScript(() => {
        try {
            window.localStorage.setItem("theme", "light");
            window.localStorage.setItem("resolvedTheme", "light");
        } catch {
            // Ignore storage errors in restricted environments.
        }
    });
}

export async function disableAnimations(page: Page) {
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                scroll-behavior: auto !important;
            }
        `,
    });
}

export async function waitForFonts(page: Page) {
    await page.evaluate(() => document.fonts?.ready);
}

export async function waitForStorybookRoot(page: Page) {
    await page.locator("#storybook-root").waitFor();
    await page.waitForFunction(() => {
        const root = document.querySelector("#storybook-root");
        if (!root) return false;
        return Array.from(root.children).some((child) => child.tagName !== "SCRIPT");
    });
}

export async function waitForVisibleImages(page: Page, selector = "img") {
    await page.evaluate(async (imageSelector) => {
        const images = Array.from(
            document.querySelectorAll<HTMLImageElement>(imageSelector),
        ).filter((image) => {
            const rect = image.getBoundingClientRect();
            return (
                rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom > 0 &&
                rect.top < window.innerHeight
            );
        });

        await Promise.all(
            images.map((image) => {
                if (image.complete) return Promise.resolve();
                return new Promise<void>((resolve) => {
                    image.addEventListener("load", () => resolve(), { once: true });
                    image.addEventListener("error", () => resolve(), { once: true });
                });
            }),
        );
    }, selector);
}

export function waitForText(text: string, exact = true) {
    return async (page: Page) => {
        await page
            .getByText(text, { exact })
            .first()
            .waitFor();
    };
}
