from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.song_repository import SongRepository
import math

class SongService:
    def __init__(self):
        self.repository = SongRepository()

    async def get_paginated_songs(self, db: AsyncSession, page: int, page_size: int, sort_by: str, order: str):
        items, total = await self.repository.get_all(db, page, page_size, sort_by, order)
        pages = math.ceil(total / page_size) if total > 0 else 1
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": pages
        }

    async def search_song(self, db: AsyncSession, title: str):
        return await self.repository.find_by_title(db, title)

    async def rate_song(self, db: AsyncSession, song_id: str, stars: int):
        return await self.repository.update_rating(db, song_id, stars)
