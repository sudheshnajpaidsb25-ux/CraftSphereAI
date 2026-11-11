import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Course, Artisan
from schemas import CourseResponse, PersonalizedLearningPlanResponse
from services.recommendation_service import generate_personalized_recommendations

router = APIRouter(tags=["Personalised Training Recommendations"])


@router.get("/api/courses", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).order_by(Course.learning_sequence_order.asc()).all()
    results = []
    for c in courses:
        ex = []
        if c.practical_exercises:
            try:
                ex = json.loads(c.practical_exercises)
            except Exception:
                ex = [c.practical_exercises]

        results.append({
            "id": c.id,
            "title": c.title,
            "craft_category": c.craft_category,
            "difficulty_level": c.difficulty_level,
            "skill_focus": c.skill_focus,
            "description": c.description,
            "traditional_master_notes": c.traditional_master_notes,
            "practical_exercises": ex,
            "learning_sequence_order": c.learning_sequence_order,
            "estimated_hours": c.estimated_hours
        })
    return results


@router.get("/api/recommendations/{artisan_id}", response_model=PersonalizedLearningPlanResponse)
def get_recommendations(artisan_id: int, db: Session = Depends(get_db)):
    """
    Module 6: Personalised Training Recommendation
    - Inputs: craft category, artisan experience, skill assessment, identified skill gaps.
    - Content-based recommendation algorithm targeting specific gaps.
    - Non-random, structured learning path.
    """
    try:
        return generate_personalized_recommendations(artisan_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

