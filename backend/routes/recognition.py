import os
import uuid
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ActivityLog, ImageRecord
from schemas import RecognitionResponse
from services.recognition_service import validate_image_file, predict_craft_category

router = APIRouter(prefix="/api/recognition", tags=["AI Craft Recognition"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads", "recognition")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/predict", response_model=RecognitionResponse)
async def predict_craft(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Module 1: AI Craft Recognition
    - Validates image format and size
    - Analyzes visual texture, color distribution, and geometry
    - Categorizes into Pottery, Bamboo and Cane, Handloom, or Wood Carving
    - Displays prediction confidence, model architecture status, and cultural details
    - Returns clear message if outside supported categories
    """
    contents = await file.read()

    # 1. Validation
    is_valid, err_msg = validate_image_file(contents, file.filename)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    # 2. Save image locally
    ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"rec_{uuid.uuid4().hex[:12]}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(saved_path, "wb") as f:
        f.write(contents)

    image_url = f"/uploads/recognition/{unique_filename}"

    # 3. Predict category
    prediction_result = predict_craft_category(contents)
    prediction_result["image_url"] = image_url

    # 4. Save metadata record
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    h, w = (img.shape[0], img.shape[1]) if img is not None else (0, 0)

    img_rec = ImageRecord(
        filename=unique_filename,
        original_filename=file.filename,
        file_path=saved_path,
        craft_category=prediction_result["predicted_category"],
        file_size_kb=round(len(contents) / 1024.0, 2),
        width=w,
        height=h
    )
    db.add(img_rec)

    # 5. Log activity
    log = ActivityLog(
        activity_type="RECOGNITION",
        title=f"Craft Recognition: {prediction_result['predicted_category']}",
        description=(
            f"Image '{file.filename}' processed with {prediction_result['confidence_percentage']}% confidence. "
            f"Result: {prediction_result['predicted_category']} ({prediction_result['status']})."
        ),
        related_entity_type="ImageRecord",
        related_entity_id=None
    )
    db.add(log)
    db.commit()

    return prediction_result

