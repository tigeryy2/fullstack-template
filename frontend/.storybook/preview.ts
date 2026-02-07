import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/styles/globals.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
        },
    },
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        nextjs: {
            appDirectory: true,
        },
        options: {
            storySort: {
                order: ["Dashboard"],
            },
        },
    },
    decorators: [
        (Story) =>
            React.createElement(
                QueryClientProvider,
                { client: queryClient },
                React.createElement(
                    "div",
                    { className: "min-h-screen bg-slate-50 p-6 text-slate-900" },
                    React.createElement(Story),
                ),
            ),
    ],
};

export default preview;
