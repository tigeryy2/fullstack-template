import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AccountSummary } from "./AccountSummary";

const meta = {
    title: "Dashboard/AccountSummary",
    component: AccountSummary,
    tags: ["autodocs"],
    args: {},
} satisfies Meta<typeof AccountSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        user: {
            name: "Jordan Lee",
            plan: "Pro plan",
            email: "jordan@example.com",
        },
        stats: {
            projects: 12,
            credits: 340,
            lastSyncedAt: "Synced 12 minutes ago",
        },
    },
};
