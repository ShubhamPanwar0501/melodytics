from sqlalchemy.orm import Session
from ..repositories.song_repository import SongRepository
import math

class SongService:
    def __init__(self):
        self.repository = SongRepository()

    def get_paginated_songs(self, db: Session, page: int, page_size: int, sort_by: str, order: str):
        items, total = self.repository.get_all(db, page, page_size, sort_by, order)
        pages = math.ceil(total / page_size) if total > 0 else 1
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": pages
        }

    def search_song(self, db: Session, title: str):
        return self.repository.find_by_title(db, title)

    def rate_song(self, db: Session, song_id: str, stars: int):
        return self.repository.update_rating(db, song_id, stars)
