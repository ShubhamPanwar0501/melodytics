import json

import pytest


pytestmark = pytest.mark.anyio


async def test_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

async def test_list_songs_empty(client):
    response = await client.get("/api/songs")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert data["pages"] == 1


async def test_search_songs_returns_partial_matches(client):
    payload = {
        "id": {"0": "track_1", "1": "track_2"},
        "title": {"0": "Test Song", "1": "Another Tune"},
        "energy": {"0": 0.8, "1": 0.4},
        "danceability": {"0": 0.7, "1": 0.5},
    }

    response = await client.post(
        "/api/ingest",
        files={"file": ("songs.json", json.dumps(payload), "application/json")},
    )
    assert response.status_code == 200

    response = await client.get("/api/songs/search", params={"title": "song"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "track_1"
    assert data[0]["title"] == "Test Song"


async def test_rate_song_updates_rating(client):
    payload = {
        "id": {"0": "track_1"},
        "title": {"0": "Test Song"},
    }

    response = await client.post(
        "/api/ingest",
        files={"file": ("songs.json", json.dumps(payload), "application/json")},
    )
    assert response.status_code == 200

    response = await client.patch("/api/songs/track_1/rating", json={"stars": 5})
    assert response.status_code == 200
    assert response.json()["star_rating"] == 5


async def test_rate_missing_song_returns_404(client):
    response = await client.patch("/api/songs/missing/rating", json={"stars": 4})
    assert response.status_code == 404
