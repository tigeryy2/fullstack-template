# Fullstack Template

A modern fullstack template featuring a Next.js frontend and a FastAPI backend, managed as a monorepo.

## Structure

- `frontend/`: Next.js application with Tailwind CSS, shadcn/ui, and TypeScript.
- `backend/`: FastAPI application managed with `uv`.

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.12+
- uv (Python package manager)

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
uv lock
uv run uvicorn backend.main:app --reload
```

The API will be available at http://127.0.0.1:8000.

### Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.

### API Client Generation

To generate the TypeScript client from the running backend:

1. Ensure the backend is running.
2. Run:

```bash
cd frontend
npm run generate:api
```

## Documentation & Recipes

We have included several common patterns and utilities in this template to speed up development:

*   **[RECIPES.md](docs/RECIPES.md):** Guides on using the included utilities for:
    *   Cloudflare R2 / S3 File Uploads
    *   MongoDB Repository Pattern
    *   Frontend Image Transformations & Downloads

## Agent Guidelines

Refer to `GEMINI.md` and `AGENTS.md` for AI agent collaboration guidelines.