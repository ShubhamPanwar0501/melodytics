from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SongBase(BaseModel):
    id: str
    title: str
    mode: Optional[int] = None
    acousticness: Optional[float] = None
    danceability: Optional[float] = None
    energy: Optional[float] = None
    instrumentalness: Optional[float] = None
    liveness: Optional[float] = None
    loudness: Optional[float] = None
    speechiness: Optional[float] = None
    tempo: Optional[float] = None
    valence: Optional[float] = None
    duration_ms: Optional[int] = None
    num_sections: Optional[int] = None
    num_segments: Optional[int] = None
    star_rating: Optional[int] = None

class SongOut(SongBase):
    created_at: datetime

    class Config:
        from_attributes = True

class PaginatedSongs(BaseModel):
    items: List[SongOut]
    total: int
    page: int
    page_size: int
    pages: int

class RatingUpdate(BaseModel):
    stars: int = Field(..., ge=1, le=5)

class IngestResult(BaseModel):
    inserted: int
    message: str
