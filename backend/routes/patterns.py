import os
import uuid
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ActivityLog
from schemas import PatternSearchResponse
from services.recognition_service import validate_image_file
from services.pattern_service import find_similar_patterns

router = APIRouter(prefix="/api/patterns", tags=["Pattern Intelligence"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads", "patterns")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/search", response_model=PatternSearchResponse)
async def search_patterns(
    file: UploadFile = File(...),
    top_k: int = 5,
    db: Session = Depends(get_db)
):
    """
    Module 2: Pattern Intelligence
    - Computes 128-dimensional multi-scale visual pattern embedding
    - Evaluates cosine similarity against heritage craft archive
    - Ranks top visual matches with similarity scores and cultural metadata
    - Transparently highlights ethical disclaimer regarding visual similarity
    """
    contents = await file.read()

    is_valid, err_msg = validate_image_file(contents, file.filename)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"pat_{uuid.uuid4().hex[:12]}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(saved_path, "wb") as f:
        f.write(contents)

    query_image_url = f"/uploads/patterns/{unique_filename}"

    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode pattern image.")

    results = find_similar_patterns(img, db=db, top_k=top_k)
    results["query_image_url"] = query_image_url

    # Activity Log
    top_match = results["matches"][0]["name"] if results["matches"] else "None"
    log = ActivityLog(
        activity_type="PATTERN_SEARCH",
        title=f"Pattern Search: Matched with {top_match}",
        description=f"Query '{file.filename}' processed across heritage archive. Closest match: {top_match}.",
        related_entity_type="Craft",
        related_entity_id=results["matches"][0]["craft_id"] if results["matches"] else None
    )
    db.add(log)
    db.commit()

    return results

