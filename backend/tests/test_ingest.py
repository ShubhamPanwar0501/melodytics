import json

def test_ingest_json(client):
    payload = {
        "id": {"0": "track_1"},
        "title": {"0": "Test Song"},
        "energy": {"0": 0.8},
        "danceability": {"0": 0.7}
    }
    
    files = {
        "file": ("songs.json", json.dumps(payload), "application/json")
    }
    
    response = client.post("/api/ingest", files=files)
    assert response.status_code == 200
    assert response.json()["inserted"] == 1
    
    # Verify in list
    response = client.get("/api/songs")
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["title"] == "Test Song"
