from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.webhooks.stripe import router as stripe_router

app = FastAPI(
    title="Fullstack Template API",
    description="API for the Fullstack Template",
    version="0.1.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stripe_router)


@app.get("/")
async def root():
    return {"message": "Hello form Fullstack Template API"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
