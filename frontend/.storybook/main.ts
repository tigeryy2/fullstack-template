import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-themes",
        "@storybook/addon-docs",
        "@storybook/addon-vitest",
    ],
    framework: {
        name: "@storybook/nextjs-vite",
        options: {},
    },
    viteFinal: (viteConfig) => {
        viteConfig.plugins = [...(viteConfig.plugins ?? []), tsconfigPaths()];
        const aliases = Array.isArray(viteConfig.resolve?.alias)
            ? viteConfig.resolve.alias
            : Object.entries(viteConfig.resolve?.alias ?? {}).map(
                  ([find, replacement]) => ({ find, replacement }),
              );
        viteConfig.resolve = viteConfig.resolve ?? {};
        viteConfig.resolve.alias = [
            { find: "@", replacement: resolve(__dirname, "../src") },
            ...aliases,
        ];
        return viteConfig;
    },
    staticDirs: ["../public"],
    docs: {
        autodocs: "tag",
    },
};

export default config;
