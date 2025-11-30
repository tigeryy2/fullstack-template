import { createClient, createConfig } from "@hey-api/client-axios";
import { getBackendUrl } from "@/lib/utils";

// Main client instance
export const client = createClient(
    createConfig({
        baseURL: getBackendUrl(),
        withCredentials: true, // Helper for cookies if needed
    }),
);

/**
 * Attaches a Bearer token to the API client for all subsequent requests.
 * Call this when your auth provider successfully retrieves a token.
 */
export function attachAuthInterceptor(token?: string) {
    client.setConfig({
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
}
