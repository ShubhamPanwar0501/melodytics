import pytest

from app.core import database
from app.routers import ingest, songs


pytestmark = pytest.mark.anyio


class FailingSongService:
    async def get_paginated_songs(self, db, page, page_size, sort_by, order):
        raise RuntimeError("list failed")

    async def search_song(self, db, title):
        raise RuntimeError("search failed")

    async def rate_song(self, db, song_id, stars):
        raise RuntimeError("rating failed")


class FailingIngestService:
    async def ingest_data(self, db, data):
        raise RuntimeError("ingest failed")


async def test_song_router_returns_500_for_service_errors(client, monkeypatch):
    monkeypatch.setattr(songs, "service", FailingSongService())

    response = await client.get("/api/songs")
    assert response.status_code == 500
    assert response.json()["detail"] == "Error fetching songs: list failed"

    response = await client.get("/api/songs/search", params={"title": "song"})
    assert response.status_code == 500
    assert response.json()["detail"] == "Error searching songs: search failed"

    response = await client.patch("/api/songs/track_1/rating", json={"stars": 5})
    assert response.status_code == 500
    assert response.json()["detail"] == "Error rating song: rating failed"


async def test_ingest_router_returns_500_for_service_error(client, monkeypatch):
    monkeypatch.setattr(ingest, "service", FailingIngestService())

    response = await client.post(
        "/api/ingest",
        files={"file": ("songs.json", "{}", "application/json")},
    )

    assert response.status_code == 500
    assert response.json()["detail"] == "Ingestion failed: ingest failed"


async def test_database_get_db_yields_and_closes_session(monkeypatch):
    class FakeSession:
        def __init__(self):
            self.closed = False

        async def close(self):
            self.closed = True

    class FakeSessionContext:
        def __init__(self):
            self.session = FakeSession()

        async def __aenter__(self):
            return self.session

        async def __aexit__(self, exc_type, exc, tb):
            return None

    context = FakeSessionContext()
    monkeypatch.setattr(database, "AsyncSessionLocal", lambda: context)

    yielded = []
    async for session in database.get_db():
        yielded.append(session)

    assert yielded == [context.session]
    assert context.session.closed is True
