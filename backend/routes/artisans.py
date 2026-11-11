import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Artisan, ActivityLog
from schemas import ArtisanCreate, ArtisanResponse

router = APIRouter(prefix="/api/artisans", tags=["Artisan Management"])


@router.get("", response_model=List[ArtisanResponse])
def list_artisans(db: Session = Depends(get_db)):
    return db.query(Artisan).order_by(Artisan.id.asc()).all()


@router.get("/{artisan_id}", response_model=ArtisanResponse)
def get_artisan(artisan_id: int, db: Session = Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail=f"Artisan with ID {artisan_id} not found.")
    return artisan


@router.post("", response_model=ArtisanResponse, status_code=201)
def register_artisan(artisan_in: ArtisanCreate, db: Session = Depends(get_db)):
    code = artisan_in.artisan_code or f"ART-GOA-{uuid.uuid4().hex[:6].upper()}"

    db_artisan = Artisan(
        artisan_code=code,
        name=artisan_in.name,
        craft_category=artisan_in.craft_category,
        experience_years=artisan_in.experience_years,
        experience_level=artisan_in.experience_level,
        village_location=artisan_in.village_location,
        contact_phone=artisan_in.contact_phone,
        bio=artisan_in.bio,
        profile_photo=artisan_in.profile_photo
    )
    db.add(db_artisan)
    db.commit()
    db.refresh(db_artisan)

    log = ActivityLog(
        activity_type="ARTISAN_REG",
        title=f"Artisan Registered: {db_artisan.name}",
        description=f"New artisan '{db_artisan.name}' registered for '{db_artisan.craft_category}' ({db_artisan.village_location}).",
        related_entity_type="Artisan",
        related_entity_id=db_artisan.id
    )
    db.add(log)
    db.commit()

    return db_artisan

