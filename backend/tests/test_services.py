import pytest

from app.services.ingest_service import IngestService
from app.services.song_service import SongService


pytestmark = pytest.mark.anyio


class FakeIngestRepository:
    def __init__(self):
        self.rows = None

    async def bulk_upsert(self, db, rows):
        self.rows = rows
        return len(rows)


class FakeSongRepository:
    async def get_all(self, db, page, page_size, sort_by, order):
        return ["song-a", "song-b", "song-c"], 21

    async def find_by_title(self, db, title):
        return [{"title": title}]

    async def update_rating(self, db, song_id, stars):
        return {"id": song_id, "star_rating": stars}


def test_ingest_pivot_filters_invalid_rows_and_columns():
    service = IngestService()
    rows = service.pivot(
        {
            "id": {"0": "track_1", "1": "track_2", "2": ""},
            "title": {"0": "First", "1": "", "2": "Missing ID"},
            "energy": {"0": 0.7, "1": 0.4, "2": 0.2},
            "ignored": {"0": "nope", "1": "nope", "2": "nope"},
        }
    )

    assert rows == [{"id": "track_1", "title": "First", "energy": 0.7}]


def test_ingest_pivot_returns_empty_for_invalid_input():
    assert IngestService().pivot(None) == []


async def test_ingest_data_returns_zero_when_no_rows():
    assert await IngestService().ingest_data(None, {}) == 0


async def test_ingest_data_bulk_upserts_rows():
    service = IngestService()
    repository = FakeIngestRepository()
    service.repository = repository

    inserted = await service.ingest_data(
        None,
        {
            "id": {"0": "track_1"},
            "title": {"0": "First"},
        },
    )

    assert inserted == 1
    assert repository.rows == [{"id": "track_1", "title": "First"}]


async def test_song_service_delegates_to_repository():
    service = SongService()
    service.repository = FakeSongRepository()

    paginated = await service.get_paginated_songs(None, 2, 10, "title", "asc")
    assert paginated == {
        "items": ["song-a", "song-b", "song-c"],
        "total": 21,
        "page": 2,
        "page_size": 10,
        "pages": 3,
    }
    assert await service.search_song(None, "First") == [{"title": "First"}]
    assert await service.rate_song(None, "track_1", 4) == {
        "id": "track_1",
        "star_rating": 4,
    }
