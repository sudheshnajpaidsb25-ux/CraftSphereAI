import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models import Artisan, Assessment, Course, Recommendation, LearningProgress
from services.assessment_service import evaluate_artisan_skill_gaps


def generate_personalized_recommendations(artisan_id: int, db: Session) -> Dict[str, Any]:
    """
    Content-based recommendation algorithm:
    1. Analyzes the artisan's skill gaps and current experience level.
    2. Identifies the criteria with the greatest shortfall from benchmark standards.
    3. Matches courses in the catalog that target those specific skills and difficulty tiers.
    4. Computes a deterministic priority rank based on gap severity and pedagogical sequence.
    5. Saves recommendations to the database so progress can be tracked persistently.
    """
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise ValueError(f"Artisan with ID {artisan_id} not found.")

    gap_data = evaluate_artisan_skill_gaps(artisan_id, db)
    gaps = gap_data["gaps"]

    # Map criteria names to skill_focus strings in Courses
    skill_focus_mapping = {
        "Shape Consistency": "Shape Consistency",
        "Surface Finish": "Surface Finish",
        "Pattern Consistency": "Pattern Consistency",
        "Symmetry": "Symmetry",
        "Detail Quality": "Detail Quality"
    }

    # Fetch available courses for this craft category
    available_courses = (
        db.query(Course)
        .filter(Course.craft_category == artisan.craft_category)
        .order_by(Course.learning_sequence_order.asc())
        .all()
    )

    # Score each course based on gap magnitude
    scored_courses = []
    weakness_summary = []

    for gap in gaps:
        crit = gap["criterion"]
        gap_val = gap["gap"]

        if gap_val > 0.3:
            weakness_summary.append(f"{crit} deficit of {gap_val:.1f} pts")

        for course in available_courses:
            match_score = 0.0
            # Direct skill focus match
            if course.skill_focus == skill_focus_mapping.get(crit):
                match_score += (gap_val * 3.0)

            # Experience level alignment
            if artisan.experience_level == course.difficulty_level:
                match_score += 2.0
            elif artisan.experience_level == "Beginner" and course.difficulty_level == "Intermediate":
                match_score += 0.5
            elif artisan.experience_level == "Master" and course.difficulty_level == "Advanced":
                match_score += 2.5

            if match_score > 0:
                scored_courses.append({
                    "course": course,
                    "gap": gap_val,
                    "match_score": match_score,
                    "focus": crit,
                    "rationale": (
                        f"Recommended because your {crit} assessment score has a shortfall of {gap_val:.1f} pts "
                        f"below the master benchmark. This {course.difficulty_level} module teaches targeted techniques "
                        f"in traditional {artisan.craft_category}."
                    )
                })

    # Sort descending by match score and deduplicate by course id
    scored_courses.sort(key=lambda x: x["match_score"], reverse=True)

    seen_ids = set()
    unique_recommendations = []
    rank = 1

    for sc in scored_courses:
        cid = sc["course"].id
        if cid not in seen_ids:
            seen_ids.add(cid)
            unique_recommendations.append({
                "course": sc["course"],
                "gap": sc["gap"],
                "rationale": sc["rationale"],
                "priority_rank": rank
            })
            rank += 1
            if rank > 4:  # Top 4 recommendations
                break

    # If no gaps or no courses matched, provide progressive general mastery modules
    if not unique_recommendations and available_courses:
        for idx, course in enumerate(available_courses[:3]):
            unique_recommendations.append({
                "course": course,
                "gap": 0.0,
                "rationale": f"Progressive master-class module {idx+1} for comprehensive refinement.",
                "priority_rank": idx + 1
            })

    # Save to database recommendations table if not already present
    for rec in unique_recommendations:
        course = rec["course"]
        existing = (
            db.query(Recommendation)
            .filter(
                Recommendation.artisan_id == artisan_id,
                Recommendation.course_id == course.id
            )
            .first()
        )
        if not existing:
            new_rec = Recommendation(
                artisan_id=artisan_id,
                course_id=course.id,
                priority_rank=rec["priority_rank"],
                identified_gap=rec["gap"],
                rationale=rec["rationale"],
                status="Recommended"
            )
            db.add(new_rec)
    db.commit()

    # Formulate suggested learning sequence
    suggested_sequence = [
        f"Step {r['priority_rank']}: Complete '{r['course'].title}' ({r['course'].estimated_hours}h) - Focus on {r['course'].skill_focus}"
        for r in unique_recommendations
    ]

    formatted_items = []
    for r in unique_recommendations:
        c = r["course"]
        exercises = []
        if c.practical_exercises:
            try:
                exercises = json.loads(c.practical_exercises)
            except Exception:
                exercises = [c.practical_exercises]

        formatted_items.append({
            "recommendation_id": r.get("recommendation_id", r["priority_rank"]),
            "priority_rank": r["priority_rank"],
            "course": {
                "id": c.id,
                "title": c.title,
                "craft_category": c.craft_category,
                "difficulty_level": c.difficulty_level,
                "skill_focus": c.skill_focus,
                "description": c.description,
                "traditional_master_notes": c.traditional_master_notes,
                "practical_exercises": exercises,
                "learning_sequence_order": c.learning_sequence_order,
                "estimated_hours": c.estimated_hours
            },
            "identified_gap": r["gap"],
            "rationale": r["rationale"],
            "status": "Recommended"
        })

    return {
        "artisan_id": artisan.id,
        "artisan_name": artisan.name,
        "craft_category": artisan.craft_category,
        "experience_level": artisan.experience_level,
        "identified_weaknesses": weakness_summary if weakness_summary else ["No significant skill deficits detected."],
        "recommendations": formatted_items,
        "suggested_sequence": suggested_sequence
    }

