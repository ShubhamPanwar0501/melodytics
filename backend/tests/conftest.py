import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app
from app.core.database import get_db
from app.routers import ingest, songs
from app.services.ingest_service import IngestService


class FakeSongService:
    def __init__(self, store):
        self.store = store

    async def get_paginated_songs(self, db, page: int, page_size: int, sort_by: str, order: str):
        items = list(self.store.values())
        reverse = order == "desc"
        items.sort(key=lambda song: song.get(sort_by) or "", reverse=reverse)

        start = (page - 1) * page_size
        end = start + page_size
        total = len(items)

        return {
            "items": items[start:end],
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": (total + page_size - 1) // page_size if total else 1,
        }

    async def search_song(self, db, title: str):
        title = title.lower()
        return [song for song in self.store.values() if title in song["title"].lower()]

    async def rate_song(self, db, song_id: str, stars: int):
        song = self.store.get(song_id)
        if song:
            song["star_rating"] = stars
        return song


class FakeIngestService:
    def __init__(self, store):
        self.store = store
        self.real_service = IngestService()

    async def ingest_data(self, db, data: dict) -> int:
        rows = self.real_service.pivot(data)
        for row in rows:
            self.store[row["id"]] = {
                **row,
                "star_rating": row.get("star_rating"),
                "created_at": datetime.now(timezone.utc),
            }
        return len(rows)


@pytest.fixture(scope="function")
def service_store(monkeypatch):
    store = {}
    monkeypatch.setattr(songs, "service", FakeSongService(store))
    monkeypatch.setattr(ingest, "service", FakeIngestService(store))
    return store


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="function")
async def client(service_store):
    async def override_get_db():
        yield None

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
