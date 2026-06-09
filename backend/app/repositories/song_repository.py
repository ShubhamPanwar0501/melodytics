from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, func
from sqlalchemy.dialects.postgresql import insert
from ..models import Song
import math

class SongRepository:
    def get_all(self, db: Session, page: int, page_size: int, sort_by: str, order: str):
        query = db.query(Song)
        
        if hasattr(Song, sort_by):
            col = getattr(Song, sort_by)
            if order == "desc":
                query = query.order_by(desc(col))
            else:
                query = query.order_by(asc(col))
        
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total

    def find_by_title(self, db: Session, title: str):
        return db.query(Song).filter(func.lower(Song.title) == title.lower()).first()

    def update_rating(self, db: Session, song_id: str, stars: int):
        song = db.query(Song).filter(Song.id == song_id).first()
        if song:
            song.star_rating = stars
            db.commit()
            db.refresh(song)
        return song

    def bulk_upsert(self, db: Session, rows: list[dict]):
        for row in rows:
            stmt = insert(Song).values(**row)
            stmt = stmt.on_conflict_do_update(
                index_elements=['id'],
                set_={k: v for k, v in row.items() if k != 'id'}
            )
            db.execute(stmt)
        db.commit()
        return len(rows)
