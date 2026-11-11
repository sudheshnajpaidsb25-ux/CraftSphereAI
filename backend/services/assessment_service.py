import cv2
import json
import numpy as np
from typing import Tuple
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from models import Assessment, Artisan, SkillCriteria, Course, Recommendation


# Benchmark master targets for each category (scale 1.0 to 10.0)
DEFAULT_CATEGORY_BENCHMARKS = {
    "Pottery": {
        "Shape Consistency": 8.5,
        "Surface Finish": 8.0,
        "Pattern Consistency": 7.5,
        "Symmetry": 8.5,
        "Detail Quality": 8.0
    },
    "Bamboo and Cane": {
        "Shape Consistency": 8.0,
        "Surface Finish": 7.5,
        "Pattern Consistency": 9.0,
        "Symmetry": 8.0,
        "Detail Quality": 8.5
    },
    "Handloom": {
        "Shape Consistency": 8.5,
        "Surface Finish": 8.5,
        "Pattern Consistency": 9.2,
        "Symmetry": 8.8,
        "Detail Quality": 8.5
    },
    "Wood Carving": {
        "Shape Consistency": 8.2,
        "Surface Finish": 8.0,
        "Pattern Consistency": 8.5,
        "Symmetry": 8.0,
        "Detail Quality": 9.0
    }
}


def analyze_craft_image_cv(img_bgr: np.ndarray) -> Dict[str, Any]:
    """
    Computes computer vision metrics directly from the craft photograph.
    Transparently labels them as optical measurements, separate from expert judgment.
    """
    if img_bgr is None or img_bgr.size == 0:
        return {
            "cv_measured_symmetry": 7.0,
            "cv_measured_smoothness": 7.0,
            "cv_edge_detail_density": 0.25,
            "measurement_notes": "No image processed; baseline estimates applied."
        }

    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # 1. Bilateral Symmetry Index:
    # Compare left half with flipped right half
    mid = w // 2
    left_half = gray[:, :mid]
    right_half = gray[:, mid:mid * 2] if w % 2 == 0 else gray[:, mid + 1:]
    right_flipped = cv2.flip(right_half, 1)

    min_w = min(left_half.shape[1], right_flipped.shape[1])
    diff = np.abs(left_half[:, :min_w].astype(float) - right_flipped[:, :min_w].astype(float))
    mean_abs_error = np.mean(diff) / 255.0  # 0.0 (perfect mirror) to 1.0 (completely dissimilar)
    # Map to 1.0 - 10.0 scale
    cv_symmetry_score = round(max(1.0, min(10.0, 10.0 * (1.0 - mean_abs_error * 1.5))), 1)

    # 2. Surface Finish / Smoothness Index:
    # Laplacian variance measures sharp texture roughness or micro-defects
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    lap_var = float(lap.var())
    # Extremely noisy/rough gives high variance, smooth burnished clay gives moderate low variance
    # Map to a 1.0 - 10.0 index
    smoothness_index = round(max(2.0, min(9.5, 9.5 - (lap_var / 300.0))), 1)

    # 3. Contour & Edge Detail Density:
    edges = cv2.Canny(gray, 50, 150)
    edge_density = round(float(np.count_nonzero(edges)) / float(edges.size), 3)

    return {
        "cv_measured_symmetry": cv_symmetry_score,
        "cv_measured_smoothness": smoothness_index,
        "cv_edge_detail_density": edge_density,
        "cv_image_resolution": f"{w}x{h}",
        "measurement_notes": (
            "Algorithmic optical measurements derived from pixel grayscale contrast and "
            "bilateral mirror differences. Used alongside, but distinct from, expert craftsman evaluations."
        )
    }


def compute_overall_score(
    shape: float,
    surface: float,
    pattern: float,
    symmetry: float,
    detail: float
) -> float:
    """
    Transparent weighted scoring: equal 20% weight across 5 standard rubric criteria.
    """
    overall = (shape * 0.20) + (surface * 0.20) + (pattern * 0.20) + (symmetry * 0.20) + (detail * 0.20)
    return round(float(overall), 2)


def generate_strengths_and_gaps(
    scores: Dict[str, float],
    benchmarks: Dict[str, float]
) -> Tuple[List[str], List[str]]:
    """Identifies transparent strengths (>= 7.5) and skill gaps (< benchmark)."""
    strengths = []
    gaps = []

    for criterion, score in scores.items():
        bench = benchmarks.get(criterion, 8.0)
        diff = round(bench - score, 2)
        if score >= 7.8:
            strengths.append(f"Strong performance in {criterion} ({score}/10.0). Demonstrates refined control.")
        if diff > 0.5:
            gaps.append(f"{criterion}: Score of {score}/10.0 is {diff} points below master benchmark ({bench}/10.0).")

    if not strengths:
        strengths.append("Foundational craft skills present; ready for structured advancement.")
    if not gaps:
        gaps.append("Mastery benchmark met across all assessed criteria.")

    return strengths, gaps


def evaluate_artisan_skill_gaps(artisan_id: int, db: Session) -> Dict[str, Any]:
    """
    Compares the artisan's latest assessment against benchmark criteria.
    Produces detailed gap values, priority rankings, and historical progress.
    """
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise ValueError(f"Artisan with ID {artisan_id} not found.")

    assessments = (
        db.query(Assessment)
        .filter(Assessment.artisan_id == artisan_id)
        .order_by(Assessment.assessment_date.asc())
        .all()
    )

    if not assessments:
        # Default empty analysis for newly registered artisan
        benchmarks = DEFAULT_CATEGORY_BENCHMARKS.get(artisan.craft_category, DEFAULT_CATEGORY_BENCHMARKS["Pottery"])
        return {
            "artisan_id": artisan.id,
            "artisan_name": artisan.name,
            "craft_category": artisan.craft_category,
            "experience_level": artisan.experience_level,
            "overall_score": 0.0,
            "benchmark_overall": 8.2,
            "gaps": [
                {
                    "criterion": crit,
                    "current_score": 0.0,
                    "target_score": target,
                    "gap": target,
                    "status": "Awaiting First Assessment",
                    "benchmark_description": f"Master standard for {crit} in traditional {artisan.craft_category}"
                }
                for crit, target in benchmarks.items()
            ],
            "top_priorities": ["Complete initial craft photo and rubric assessment."],
            "historical_progress": []
        }

    latest = assessments[-1]
    benchmarks = DEFAULT_CATEGORY_BENCHMARKS.get(latest.craft_category, DEFAULT_CATEGORY_BENCHMARKS["Pottery"])

    scores = {
        "Shape Consistency": latest.shape_consistency,
        "Surface Finish": latest.surface_finish,
        "Pattern Consistency": latest.pattern_consistency,
        "Symmetry": latest.symmetry,
        "Detail Quality": latest.detail_quality
    }

    gap_items = []
    priorities = []

    for crit, curr in scores.items():
        bench = benchmarks.get(crit, 8.0)
        gap = round(bench - curr, 2)
        if gap > 1.5:
            status = "High Priority Gap"
            priorities.append(f"Immediate focus needed on {crit} (Gap: {gap})")
        elif gap > 0.0:
            status = "Moderate Gap"
        else:
            status = "Target Met"

        gap_items.append({
            "criterion": crit,
            "current_score": curr,
            "target_score": bench,
            "gap": max(0.0, gap),
            "status": status,
            "benchmark_description": f"Master standard for {crit} in Goan {latest.craft_category}"
        })

    # Sort gaps highest to lowest
    gap_items.sort(key=lambda x: x["gap"], reverse=True)

    # Historical timeline
    history = []
    for a in assessments:
        history.append({
            "assessment_id": a.id,
            "date": a.assessment_date.strftime("%Y-%m-%d") if a.assessment_date else "N/A",
            "overall_score": a.overall_score,
            "shape_consistency": a.shape_consistency,
            "surface_finish": a.surface_finish,
            "pattern_consistency": a.pattern_consistency,
            "symmetry": a.symmetry,
            "detail_quality": a.detail_quality
        })

    benchmark_overall = round(sum(benchmarks.values()) / len(benchmarks), 2)

    return {
        "artisan_id": artisan.id,
        "artisan_name": artisan.name,
        "craft_category": latest.craft_category,
        "experience_level": artisan.experience_level,
        "overall_score": latest.overall_score,
        "benchmark_overall": benchmark_overall,
        "gaps": gap_items,
        "top_priorities": priorities if priorities else ["Maintain consistent master-grade quality across production runs."],
        "historical_progress": history
    }

