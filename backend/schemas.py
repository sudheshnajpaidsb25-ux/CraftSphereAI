from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


# -------------------------------------------------------------
# Craft Schemas
# -------------------------------------------------------------
class CraftBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., description="Pottery, Bamboo and Cane, Handloom, or Wood Carving")
    material: str
    traditional_technique: str
    region_of_origin: str
    cultural_description: str
    image_url: Optional[str] = None
    source_reference: Optional[str] = None
    license_info: Optional[str] = "Creative Commons CC-BY-NC-SA 4.0"
    is_verified: bool = True


class CraftCreate(CraftBase):
    pass


class CraftUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    material: Optional[str] = None
    traditional_technique: Optional[str] = None
    region_of_origin: Optional[str] = None
    cultural_description: Optional[str] = None
    image_url: Optional[str] = None
    source_reference: Optional[str] = None
    license_info: Optional[str] = None
    is_verified: Optional[bool] = None


class CraftResponse(CraftBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Artisan Schemas
# -------------------------------------------------------------
class ArtisanBase(BaseModel):
    artisan_code: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=150)
    craft_category: str
    experience_years: int = Field(default=1, ge=0, le=70)
    experience_level: str = Field(default="Intermediate", description="Beginner, Intermediate, Master")
    village_location: str = "Goa"
    contact_phone: Optional[str] = None
    bio: Optional[str] = None
    profile_photo: Optional[str] = None


class ArtisanCreate(ArtisanBase):
    pass


class ArtisanResponse(ArtisanBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Assessment & Skill Gap Schemas
# -------------------------------------------------------------
class AssessmentCreate(BaseModel):
    artisan_id: int
    craft_category: str
    craft_title: Optional[str] = "Artisan Craft Submission"
    image_url: Optional[str] = None
    shape_consistency: float = Field(..., ge=1.0, le=10.0)
    surface_finish: float = Field(..., ge=1.0, le=10.0)
    pattern_consistency: float = Field(..., ge=1.0, le=10.0)
    symmetry: float = Field(..., ge=1.0, le=10.0)
    detail_quality: float = Field(..., ge=1.0, le=10.0)
    expert_notes: Optional[str] = None
    cv_measured_symmetry: Optional[float] = None
    cv_measured_smoothness: Optional[float] = None


class AssessmentResponse(BaseModel):
    id: int
    artisan_id: int
    artisan_name: Optional[str] = None
    craft_category: str
    craft_title: str
    image_url: Optional[str] = None
    shape_consistency: float
    surface_finish: float
    pattern_consistency: float
    symmetry: float
    detail_quality: float
    cv_metrics: Optional[Dict[str, Any]] = None
    expert_notes: Optional[str] = None
    overall_score: float
    strengths: List[str] = []
    improvement_areas: List[str] = []
    assessment_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SkillGapItem(BaseModel):
    criterion: str
    current_score: float
    target_score: float
    gap: float
    status: str  # "Target Met", "Moderate Gap", "High Priority Gap"
    benchmark_description: str


class SkillGapAnalysisResponse(BaseModel):
    artisan_id: int
    artisan_name: str
    craft_category: str
    experience_level: str
    overall_score: float
    benchmark_overall: float
    gaps: List[SkillGapItem]
    top_priorities: List[str]
    historical_progress: List[Dict[str, Any]] = []


# -------------------------------------------------------------
# Recommendation & Course Schemas
# -------------------------------------------------------------
class CourseResponse(BaseModel):
    id: int
    title: str
    craft_category: str
    difficulty_level: str
    skill_focus: str
    description: str
    traditional_master_notes: Optional[str] = None
    practical_exercises: List[str] = []
    learning_sequence_order: int
    estimated_hours: int

    model_config = ConfigDict(from_attributes=True)


class RecommendationItem(BaseModel):
    recommendation_id: int
    priority_rank: int
    course: CourseResponse
    identified_gap: float
    rationale: str
    status: str


class PersonalizedLearningPlanResponse(BaseModel):
    artisan_id: int
    artisan_name: str
    craft_category: str
    experience_level: str
    identified_weaknesses: List[str]
    recommendations: List[RecommendationItem]
    suggested_sequence: List[str]


# -------------------------------------------------------------
# AI Craft Recognition Schemas
# -------------------------------------------------------------
class RecognitionCandidate(BaseModel):
    category: str
    confidence_percentage: float


class RecognitionResponse(BaseModel):
    status: str  # "success" or "unsupported_category"
    predicted_category: str
    confidence: float
    confidence_percentage: float
    is_supported: bool
    is_trained_model: bool
    model_architecture: str
    explanation: str
    craft_details: Optional[Dict[str, Any]] = None
    all_probabilities: List[RecognitionCandidate] = []
    image_url: str


# -------------------------------------------------------------
# Pattern Intelligence Schemas
# -------------------------------------------------------------
class PatternMatchItem(BaseModel):
    craft_id: int
    name: str
    category: str
    region_of_origin: str
    material: str
    traditional_technique: str
    similarity_score: float
    similarity_percentage: float
    image_url: Optional[str] = None
    cultural_context: str


class PatternSearchResponse(BaseModel):
    status: str
    query_image_url: str
    model_method: str
    disclaimer: str
    matches: List[PatternMatchItem]


# -------------------------------------------------------------
# Knowledge Assistant Schemas
# -------------------------------------------------------------
class KnowledgeQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500)
    top_k: int = Field(default=3, ge=1, le=10)


class KnowledgeSourceItem(BaseModel):
    title: str
    category: str
    region: str
    relevance_score: float
    excerpt: str
    source_reference: Optional[str] = None


class KnowledgeQueryResponse(BaseModel):
    query: str
    answer: str
    retrieval_method: str
    sources: List[KnowledgeSourceItem]


# -------------------------------------------------------------
# Dashboard Statistics Schema
# -------------------------------------------------------------
class DashboardMetricsResponse(BaseModel):
    total_crafts: int
    total_verified_crafts: int
    total_artisans: int
    total_assessments: int
    total_recommendations: int
    craft_category_distribution: Dict[str, int]
    recent_activities: List[Dict[str, Any]]
    average_assessment_score: float
