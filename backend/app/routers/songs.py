from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..schemas import PaginatedSongs, SongOut, RatingUpdate
from ..services.song_service import SongService

router = APIRouter(prefix="/api/songs", tags=["songs"])
service = SongService()

@router.get("", response_model=PaginatedSongs)
async def list_songs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("title"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await service.get_paginated_songs(db, page, page_size, sort_by, order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching songs: {str(e)}")

from typing import List

@router.get("/search", response_model=List[SongOut])
async def search_song(title: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    try:
        songs = await service.search_song(db, title)
        return songs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching songs: {str(e)}")

@router.patch("/{song_id}/rating", response_model=SongOut)
async def rate_song(song_id: str, payload: RatingUpdate, db: AsyncSession = Depends(get_db)):
    try:
        song = await service.rate_song(db, song_id, payload.stars)
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")
        return song
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rating song: {str(e)}")
