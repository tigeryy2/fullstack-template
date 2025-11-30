import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    plugins: ["@hey-api/client-axios"],
    input: "http://127.0.0.1:8000/openapi.json",
    output: {
        path: "src/client/api",
        format: "prettier",
        lint: "eslint",
    },
});
