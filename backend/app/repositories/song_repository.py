from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, asc, func, select
from sqlalchemy.dialects.postgresql import insert as postgres_insert
from ..models import Song

class SongRepository:
    async def get_all(self, db: AsyncSession, page: int, page_size: int, sort_by: str, order: str):
        # Base query for items
        stmt = select(Song)
        
        if hasattr(Song, sort_by):
            col = getattr(Song, sort_by)
            if order == "desc":
                stmt = stmt.order_by(desc(col))
            else:
                stmt = stmt.order_by(asc(col))
        
        # Query for total count
        count_stmt = select(func.count()).select_from(Song)
        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0
        
        # Paginated results
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(stmt)
        items = result.scalars().all()
        
        return items, total

    async def find_by_title(self, db: AsyncSession, title: str):
        stmt = select(Song).filter(Song.title.ilike(f"%{title}%"))
        result = await db.execute(stmt)
        return result.scalars().all()

    async def update_rating(self, db: AsyncSession, song_id: str, stars: int):
        stmt = select(Song).filter(Song.id == song_id)
        result = await db.execute(stmt)
        song = result.scalar_one_or_none()
        
        if song:
            song.star_rating = stars
            await db.commit()
            await db.refresh(song)
        return song

    async def bulk_upsert(self, db: AsyncSession, rows: list[dict]):
        insert = postgres_insert

        for row in rows:
            stmt = insert(Song).values(**row)
            stmt = stmt.on_conflict_do_update(
                index_elements=['id'],
                set_={k: v for k, v in row.items() if k != 'id'}
            )
            await db.execute(stmt)
        await db.commit()
        return len(rows)
