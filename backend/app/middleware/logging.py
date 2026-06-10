import logging
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("melodytics.access")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs every incoming request and its response.

    Emits a structured log line like:
        INFO  GET /api/songs 200 | 42ms | req_id=<uuid>
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        req_id = str(uuid.uuid4())[:8]
        start = time.perf_counter()

        logger.info(
            "→ %s %s | req_id=%s | client=%s",
            request.method,
            request.url.path,
            req_id,
            request.client.host if request.client else "unknown",
        )

        response: Response = await call_next(request)

        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "← %s %s %d | %.1fms | req_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            req_id,
        )

        # Attach request-id header so clients/logs can correlate
        response.headers["X-Request-ID"] = req_id
        return response
