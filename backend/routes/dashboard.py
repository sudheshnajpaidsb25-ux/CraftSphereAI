from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Craft, Artisan, Assessment, Recommendation, ActivityLog
from schemas import DashboardMetricsResponse

router = APIRouter(tags=["Dashboard & Health"])


@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CraftSphere AI Backend",
        "version": "1.0.0",
        "theme": "Goa AI Hackathon 2026 - Cultural Heritage Preservation & Artisan Development"
    }


@router.get("/api/dashboard", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Computes real-time dynamic dashboard statistics directly from the database.
    No hardcoded statistics.
    """
    total_crafts = db.query(Craft).count()
    total_verified = db.query(Craft).filter(Craft.is_verified == True).count()
    total_artisans = db.query(Artisan).count()
    total_assessments = db.query(Assessment).count()
    total_recommendations = db.query(Recommendation).count()

    # Category distribution for crafts
    distribution_raw = (
        db.query(Craft.category, func.count(Craft.id))
        .group_by(Craft.category)
        .all()
    )
    category_distribution = {cat: count for cat, count in distribution_raw}

    # Ensure all 4 categories exist in dict even if count is 0
    for standard_cat in ["Pottery", "Bamboo and Cane", "Handloom", "Wood Carving"]:
        if standard_cat not in category_distribution:
            category_distribution[standard_cat] = 0

    # Average assessment score
    avg_score_raw = db.query(func.avg(Assessment.overall_score)).scalar()
    avg_score = round(float(avg_score_raw), 1) if avg_score_raw is not None else 0.0

    # Recent activities (last 8)
    recent_logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.timestamp.desc())
        .limit(8)
        .all()
    )

    activities = []
    for log in recent_logs:
        activities.append({
            "id": log.id,
            "type": log.activity_type,
            "title": log.title,
            "description": log.description,
            "time": log.timestamp.strftime("%Y-%m-%d %H:%M") if log.timestamp else "Recently",
            "entity": log.related_entity_type
        })

    return {
        "total_crafts": total_crafts,
        "total_verified_crafts": total_verified,
        "total_artisans": total_artisans,
        "total_assessments": total_assessments,
        "total_recommendations": total_recommendations,
        "craft_category_distribution": category_distribution,
        "recent_activities": activities,
        "average_assessment_score": avg_score
    }

