from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas import PaginatedSongs, SongOut, RatingUpdate
from ..services.song_service import SongService

router = APIRouter(prefix="/api/songs", tags=["songs"])
service = SongService()

@router.get("", response_model=PaginatedSongs)
def list_songs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("title"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    return service.get_paginated_songs(db, page, page_size, sort_by, order)

@router.get("/search", response_model=SongOut)
def search_song(title: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    song = service.search_song(db, title)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song

@router.patch("/{song_id}/rating", response_model=SongOut)
def rate_song(song_id: str, payload: RatingUpdate, db: Session = Depends(get_db)):
    song = service.rate_song(db, song_id, payload.stars)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song
