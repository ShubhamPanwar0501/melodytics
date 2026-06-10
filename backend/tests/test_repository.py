from types import SimpleNamespace

import pytest

from app.repositories.song_repository import SongRepository


pytestmark = pytest.mark.anyio


class FakeScalarRows:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows


class FakeResult:
    def __init__(self, scalar_value=None, rows=None, one_or_none=None):
        self.scalar_value = scalar_value
        self.rows = rows or []
        self.one_or_none = one_or_none

    def scalar(self):
        return self.scalar_value

    def scalars(self):
        return FakeScalarRows(self.rows)

    def scalar_one_or_none(self):
        return self.one_or_none


class FakeAsyncSession:
    def __init__(self, results=None, dialect_name="sqlite"):
        self.results = list(results or [])
        self.executed = []
        self.committed = False
        self.refreshed = None
        self.bind = SimpleNamespace(dialect=SimpleNamespace(name=dialect_name))

    async def execute(self, stmt):
        self.executed.append(stmt)
        if self.results:
            return self.results.pop(0)
        return FakeResult()

    async def commit(self):
        self.committed = True

    async def refresh(self, song):
        self.refreshed = song

    def get_bind(self):
        return self.bind


async def test_get_all_returns_sorted_paginated_rows_and_total():
    session = FakeAsyncSession(
        results=[
            FakeResult(scalar_value=2),
            FakeResult(rows=["song-b", "song-a"]),
        ]
    )

    items, total = await SongRepository().get_all(session, 1, 10, "title", "desc")

    assert items == ["song-b", "song-a"]
    assert total == 2
    assert len(session.executed) == 2


async def test_get_all_supports_ascending_and_unknown_sort_field():
    session = FakeAsyncSession(
        results=[
            FakeResult(scalar_value=1),
            FakeResult(rows=["song-a"]),
            FakeResult(scalar_value=1),
            FakeResult(rows=["song-a"]),
        ]
    )
    repository = SongRepository()

    assert await repository.get_all(session, 1, 10, "title", "asc") == (["song-a"], 1)
    assert await repository.get_all(session, 1, 10, "not_a_column", "asc") == (["song-a"], 1)


async def test_find_by_title_returns_partial_matches():
    session = FakeAsyncSession(results=[FakeResult(rows=["song-a"])])

    assert await SongRepository().find_by_title(session, "song") == ["song-a"]


async def test_update_rating_commits_and_refreshes_existing_song():
    song = SimpleNamespace(id="track_1", star_rating=None)
    session = FakeAsyncSession(results=[FakeResult(one_or_none=song)])

    result = await SongRepository().update_rating(session, "track_1", 5)

    assert result is song
    assert song.star_rating == 5
    assert session.committed is True
    assert session.refreshed is song


async def test_update_rating_returns_none_for_missing_song():
    session = FakeAsyncSession(results=[FakeResult(one_or_none=None)])

    assert await SongRepository().update_rating(session, "missing", 5) is None
    assert session.committed is False


async def test_bulk_upsert_executes_and_commits_for_sqlite():
    session = FakeAsyncSession()

    inserted = await SongRepository().bulk_upsert(
        session,
        [{"id": "track_1", "title": "First"}],
    )

    assert inserted == 1
    assert len(session.executed) == 1
    assert session.committed is True
