# FULLSTACK TEMPLATE
Template for monorepo fullstack project hosted on Vercel (at least initially) with Next.js + Typescript Frontend, Python Flask Backend

## Structure

Due to how Vercel's Serverless Functions work, the "backend" is placed into `frontend/backend/`. Eventually, should the project mature
and the backend moved to a different host, it should be moved back to `backend`