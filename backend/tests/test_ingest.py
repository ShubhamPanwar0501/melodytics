import json

import pytest


pytestmark = pytest.mark.anyio


async def test_ingest_json(client):
    payload = {
        "id": {"0": "track_1"},
        "title": {"0": "Test Song"},
        "energy": {"0": 0.8},
        "danceability": {"0": 0.7}
    }
    
    files = {
        "file": ("songs.json", json.dumps(payload), "application/json")
    }
    
    response = await client.post("/api/ingest", files=files)
    assert response.status_code == 200
    assert response.json()["inserted"] == 1
    
    # Verify in list
    response = await client.get("/api/songs")
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["title"] == "Test Song"


async def test_ingest_rejects_non_json_file(client):
    response = await client.post(
        "/api/ingest",
        files={"file": ("songs.txt", "{}", "text/plain")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Only .json files are accepted"


async def test_ingest_rejects_invalid_json(client):
    response = await client.post(
        "/api/ingest",
        files={"file": ("songs.json", "{not-json", "application/json")},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "Invalid JSON"
