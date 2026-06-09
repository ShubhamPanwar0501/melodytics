import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas import IngestResult
from ..services.ingest_service import IngestService

router = APIRouter(prefix="/api", tags=["ingest"])
service = IngestService()

@router.post("/ingest", response_model=IngestResult)
async def ingest_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files are accepted")

    contents = await file.read()
    try:
        data = json.loads(contents)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Invalid JSON")

    try:
        count = service.ingest_data(db, data)
        return IngestResult(inserted=count, message=f"Successfully ingested {count} songs")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
