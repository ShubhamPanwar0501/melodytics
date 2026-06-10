from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.song_repository import SongRepository

class IngestService:
    def __init__(self):
        self.repository = SongRepository()

    def pivot(self, data: dict) -> list[dict]:
        """Convert column-oriented JSON to list of row dicts."""
        if not data or not isinstance(data, dict):
            return []
        
        # Allowed columns from the Song model
        allowed_columns = {
            "id", "title", "mode", "acousticness", "danceability", 
            "energy", "instrumentalness", "liveness", "loudness", 
            "speechiness", "tempo", "valence", "duration_ms", 
            "num_sections", "num_segments"
        }
        
        # Determine indices from the first available column
        first_col_key = next(iter(data))
        indices = data[first_col_key].keys()
        
        # Only process columns that exist in our database model
        valid_data_keys = [k for k in data.keys() if k in allowed_columns]
        
        rows = []
        for i in indices:
            row = {col: data[col].get(i) for col in valid_data_keys}
            # Mandatory fields check
            if row.get("id") and row.get("title"):
                rows.append(row)
        return rows

    async def ingest_data(self, db: AsyncSession, data: dict) -> int:
        rows = self.pivot(data)
        if not rows:
            return 0
        return await self.repository.bulk_upsert(db, rows)
