import { beforeAll, vi } from "vitest";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import * as projectAnnotations from "./preview";

const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);

vi.mock("next/navigation", async () => {
    const actual = await vi.importActual<typeof import("next/navigation")>(
        "next/navigation",
    );
    return {
        ...actual,
        useRouter: () => ({ push: vi.fn() }),
        usePathname: () => "/dashboard",
    };
});
