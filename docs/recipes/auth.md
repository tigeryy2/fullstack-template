# Authentication with Google & NextAuth

This recipe explains how to set up Google Sign-In using NextAuth.js on the frontend and verify tokens on the FastAPI backend.

## 1. Google Cloud Setup

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Configure the **OAuth Consent Screen**.
4.  Create **Credentials** > **OAuth Client ID** (Web Application).
5.  Add authorized origins (e.g., `http://localhost:3000`) and redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`).

## 2. Frontend (NextAuth)

Install dependencies:
```bash
npm install next-auth
```

Configure `src/auth.ts` (or `app/api/auth/[...nextauth]/route.ts`):

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token; // Important: Persist ID token
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string;
      return session;
    },
  },
});
```

## 3. Backend Verification

The backend verifies the Google ID Token sent by the frontend.

**File:** `backend/api/utils/auth.py`

This file provides a `get_current_user` dependency that:
1.  Extracts the Bearer token from the Authorization header.
2.  Verifies the token signature using Google's public keys (`google-auth` library).
3.  Matches the `sub` (subject) claim to a user in your database.

## 4. Connecting the Two

Use the `useAuthorizedClient` hook (`frontend/src/hooks/useAuthorizedClient.ts`) to automatically attach the ID token to all requests made to your backend.

```typescript
const client = useAuthorizedClient();
// All requests via 'client' now have the Authorization header
```
