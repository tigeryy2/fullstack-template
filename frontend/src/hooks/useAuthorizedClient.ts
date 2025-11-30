import { useEffect } from "react";
// import { useSession } from "next-auth/react"; // User should uncomment if using NextAuth
import { attachAuthInterceptor, client } from "../client/clients";

/**
 * Hook that keeps the API client authenticated.
 * 
 * ADAPTATION REQUIRED:
 * This example assumes you have a way to get an access token (e.g. NextAuth's useSession).
 * Replace `useSession` and `session.accessToken` with your actual auth logic.
 */
export function useAuthorizedClient() {
    // const { data: session } = useSession();
    const token = null; // session?.accessToken;

    // Attach synchronously on first render if token is available
    if (token) {
        attachAuthInterceptor(token);
    }

    useEffect(() => {
        attachAuthInterceptor(token || undefined);
    }, [token]);

    return client;
}
