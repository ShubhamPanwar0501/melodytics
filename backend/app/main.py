from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.logging_config import configure_logging
from .middleware.logging import LoggingMiddleware
from .middleware.exception_handler import global_exception_handler
from .routers import songs, ingest

# ── Logging ──────────────────────────────────────────────────────────────────
configure_logging()

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Melodytics API")

# ── Middleware (order matters: first added = outermost wrap) ──────────────────
# 1. CORS — must be outermost so pre-flight OPTIONS requests are handled first
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Request / response logging
app.add_middleware(LoggingMiddleware)

# ── Global exception handler ──────────────────────────────────────────────────
app.add_exception_handler(Exception, global_exception_handler)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(songs.router)
app.include_router(ingest.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
