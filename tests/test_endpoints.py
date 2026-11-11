import sys
import os
import cv2
import numpy as np
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from database import SessionLocal
from routes.dashboard import health_check, get_dashboard_metrics
from routes.crafts import list_crafts, get_craft, create_craft, update_craft, delete_craft
from schemas import CraftCreate, CraftUpdate, ArtisanCreate, AssessmentCreate
from routes.artisans import list_artisans, register_artisan, get_artisan
from routes.assessments import create_assessment, get_assessment, get_artisan_assessments
from services.recognition_service import predict_craft_category, validate_image_file, SUPPORTED_CATEGORIES
from services.pattern_service import find_similar_patterns, compute_pattern_embedding, cosine_similarity
from services.assessment_service import evaluate_artisan_skill_gaps, compute_overall_score
from services.recommendation_service import generate_personalized_recommendations
from services.knowledge_service import query_heritage_knowledge


@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def create_dummy_craft_image():
    img = np.zeros((224, 224, 3), dtype=np.uint8)
    img[:] = (35, 75, 185)  # Terracotta color
    cv2.circle(img, (112, 112), 60, (20, 50, 140), -1)
    return img


def test_health_check_endpoint():
    res = health_check()
    assert res["status"] == "healthy"
    assert "CraftSphere AI" in res["service"]
    assert res["version"] == "1.0.0"


def test_dashboard_metrics_dynamic(db):
    metrics = get_dashboard_metrics(db=db)
    assert metrics["total_crafts"] >= 8
    assert metrics["total_artisans"] >= 4
    assert metrics["total_assessments"] >= 2
    assert "Pottery" in metrics["craft_category_distribution"]
    assert "Bamboo and Cane" in metrics["craft_category_distribution"]
    assert "Handloom" in metrics["craft_category_distribution"]
    assert "Wood Carving" in metrics["craft_category_distribution"]
    assert len(metrics["recent_activities"]) > 0


def test_crafts_crud_and_filters(db):
    # 1. Filter by category
    pottery_crafts = list_crafts(category="Pottery", search=None, verified_only=None, db=db)
    assert len(pottery_crafts) >= 2
    for c in pottery_crafts:
        assert "Pottery" in c.category

    # 2. Filter by verification status
    unverified = list_crafts(category=None, search=None, verified_only=False, db=db)
    assert len(unverified) >= 1
    assert unverified[0].is_verified is False

    # 3. Create new craft
    craft_in = CraftCreate(
        name="Pytest Test Bicholim Clay Cup",
        category="Pottery",
        material="Red clay and silt",
        traditional_technique="Wheel throwing",
        region_of_origin="Bicholim, North Goa",
        cultural_description="Automated test sample for cultural archive verification.",
        is_verified=True
    )
    created = create_craft(craft_in=craft_in, db=db)
    assert created.id is not None
    assert created.name == "Pytest Test Bicholim Clay Cup"

    # 4. Fetch by ID
    fetched = get_craft(craft_id=created.id, db=db)
    assert fetched.id == created.id

    # 5. Update craft
    updated = update_craft(craft_id=created.id, craft_update=CraftUpdate(material="Refined red clay"), db=db)
    assert updated.material == "Refined red clay"

    # 6. Delete craft
    delete_craft(craft_id=created.id, db=db)


def test_ai_craft_recognition_pipeline():
    img = create_dummy_craft_image()
    res = predict_craft_category(img)
    assert res["status"] in ["success", "unsupported_category"]
    assert res["predicted_category"] in SUPPORTED_CATEGORIES or res["predicted_category"] == "Unknown / Non-Craft Subject"
    assert res["confidence"] >= 0.0
    assert "all_probabilities" in res
    assert len(res["all_probabilities"]) == 4

    # File validation test
    valid, msg = validate_image_file(b"bad", "test.txt")
    assert not valid


def test_pattern_intelligence_cosine_search(db):
    img = create_dummy_craft_image()
    results = find_similar_patterns(img, db=db, top_k=3)
    assert results["status"] == "success"
    assert "disclaimer" in results
    assert "Ethical Cultural AI Notice" in results["disclaimer"]
    assert len(results["matches"]) <= 3
    for m in results["matches"]:
        assert 0.0 <= m["similarity_score"] <= 1.0


def test_artisan_registration_and_assessment(db):
    # Register artisan
    artisan_in = ArtisanCreate(
        name="Devdas Kumbhar",
        craft_category="Pottery",
        experience_years=6,
        experience_level="Intermediate",
        village_location="Bordem, Bicholim",
        bio="Test artisan for automated rubric assessment."
    )
    artisan = register_artisan(artisan_in=artisan_in, db=db)
    assert artisan.id is not None

    # Submit assessment
    ass_in = AssessmentCreate(
        artisan_id=artisan.id,
        craft_category="Pottery",
        craft_title="Test Earthen Bowl",
        shape_consistency=8.5,
        surface_finish=7.5,
        pattern_consistency=7.0,
        symmetry=7.0,
        detail_quality=8.0,
        expert_notes="Clean rim lines; moderate symmetry deviation."
    )
    ass_res = create_assessment(data=ass_in, db=db)
    # Expected: (8.5 + 7.5 + 7.0 + 7.0 + 8.0) * 0.20 = 7.60
    assert ass_res["overall_score"] == 7.60
    assert len(ass_res["strengths"]) > 0
    assert len(ass_res["improvement_areas"]) > 0


def test_skill_gap_analysis(db):
    artisans = list_artisans(db=db)
    assert len(artisans) > 0
    artisan_id = artisans[0].id

    gap_data = evaluate_artisan_skill_gaps(artisan_id=artisan_id, db=db)
    assert gap_data["artisan_id"] == artisan_id
    assert len(gap_data["gaps"]) == 5
    for g in gap_data["gaps"]:
        assert "criterion" in g
        assert "current_score" in g
        assert "target_score" in g
        assert g["gap"] >= 0.0


def test_personalized_training_recommendations(db):
    artisans = list_artisans(db=db)
    artisan_id = artisans[0].id

    plan = generate_personalized_recommendations(artisan_id=artisan_id, db=db)
    assert plan["artisan_id"] == artisan_id
    assert len(plan["recommendations"]) > 0
    top_rec = plan["recommendations"][0]
    assert "course" in top_rec
    assert "practical_exercises" in top_rec["course"]
    assert len(plan["suggested_sequence"]) > 0


def test_heritage_knowledge_assistant(db):
    q_res = query_heritage_knowledge("What traditional technique is used for Bicholim water vessels?", db=db)
    assert "answer" in q_res
    assert len(q_res["sources"]) > 0
    assert "Bicholim" in q_res["sources"][0]["title"] or "Pottery" in q_res["sources"][0]["category"]
    assert q_res["sources"][0]["relevance_score"] > 0.0

