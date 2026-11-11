import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Craft, ActivityLog
from schemas import CraftCreate, CraftUpdate, CraftResponse
from services.pattern_service import compute_pattern_embedding, compute_synthetic_embedding
import json
import cv2
import numpy as np

router = APIRouter(prefix="/api/crafts", tags=["Digital Heritage Archive"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads", "crafts")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=List[CraftResponse])
def list_crafts(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name, technique, or region"),
    verified_only: Optional[bool] = Query(None, description="Filter by verification status"),
    db: Session = Depends(get_db)
):
    query = db.query(Craft)
    if category and category.strip():
        query = query.filter(Craft.category.ilike(f"%{category.strip()}%"))
    if verified_only is not None:
        query = query.filter(Craft.is_verified == verified_only)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Craft.name.ilike(term)) |
            (Craft.traditional_technique.ilike(term)) |
            (Craft.region_of_origin.ilike(term)) |
            (Craft.material.ilike(term))
        )
    return query.order_by(Craft.id.desc()).all()


@router.get("/{craft_id}", response_model=CraftResponse)
def get_craft(craft_id: int, db: Session = Depends(get_db)):
    craft = db.query(Craft).filter(Craft.id == craft_id).first()
    if not craft:
        raise HTTPException(status_code=404, detail=f"Craft with ID {craft_id} not found.")
    return craft


@router.post("", response_model=CraftResponse, status_code=201)
def create_craft(craft_in: CraftCreate, db: Session = Depends(get_db)):
    # Create synthetic embedding if none exists
    initial_embedding = compute_synthetic_embedding(craft_in.category, seed=len(craft_in.name))

    db_craft = Craft(
        name=craft_in.name,
        category=craft_in.category,
        material=craft_in.material,
        traditional_technique=craft_in.traditional_technique,
        region_of_origin=craft_in.region_of_origin,
        cultural_description=craft_in.cultural_description,
        image_url=craft_in.image_url,
        source_reference=craft_in.source_reference,
        license_info=craft_in.license_info or "Creative Commons CC-BY-NC-SA 4.0",
        is_verified=craft_in.is_verified,
        feature_embedding=json.dumps(initial_embedding)
    )
    db.add(db_craft)
    db.commit()
    db.refresh(db_craft)

    # Activity Log
    log = ActivityLog(
        activity_type="ARCHIVE_ADD",
        title=f"New Heritage Craft Added: {db_craft.name}",
        description=f"Added '{db_craft.name}' under category '{db_craft.category}' ({'Verified' if db_craft.is_verified else 'Unverified'}).",
        related_entity_type="Craft",
        related_entity_id=db_craft.id
    )
    db.add(log)
    db.commit()

    return db_craft


@router.put("/{craft_id}", response_model=CraftResponse)
def update_craft(craft_id: int, craft_update: CraftUpdate, db: Session = Depends(get_db)):
    craft = db.query(Craft).filter(Craft.id == craft_id).first()
    if not craft:
        raise HTTPException(status_code=404, detail=f"Craft with ID {craft_id} not found.")

    update_data = craft_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(craft, field, val)

    db.commit()
    db.refresh(craft)
    return craft


@router.delete("/{craft_id}", status_code=204)
def delete_craft(craft_id: int, db: Session = Depends(get_db)):
    craft = db.query(Craft).filter(Craft.id == craft_id).first()
    if not craft:
        raise HTTPException(status_code=404, detail=f"Craft with ID {craft_id} not found.")
    db.delete(craft)
    db.commit()
    return None


@router.post("/upload-image")
async def upload_craft_image(file: UploadFile = File(...)):
    """Uploads an image file to the local uploads directory."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png"]:
        raise HTTPException(status_code=400, detail="Invalid image extension. Only JPG, JPEG, and PNG accepted.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit.")

    unique_name = f"craft_{uuid.uuid4().hex[:12]}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(dest_path, "wb") as f:
        f.write(contents)

    return {"image_url": f"/uploads/crafts/{unique_name}"}

