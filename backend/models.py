import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base


class Craft(Base):
    __tablename__ = "crafts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # Pottery, Bamboo and Cane, Handloom, Wood Carving
    material = Column(String(150), nullable=False)
    traditional_technique = Column(String(200), nullable=False)
    region_of_origin = Column(String(150), nullable=False)
    cultural_description = Column(Text, nullable=False)
    image_url = Column(String(300), nullable=True)
    source_reference = Column(String(250), nullable=True)
    license_info = Column(String(150), default="Creative Commons CC-BY-NC-SA 4.0")
    is_verified = Column(Boolean, default=True)
    feature_embedding = Column(Text, nullable=True)  # JSON-encoded embedding list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(Integer, primary_key=True, index=True)
    artisan_code = Column(String(50), unique=True, index=True)
    name = Column(String(150), nullable=False)
    craft_category = Column(String(50), nullable=False)
    experience_years = Column(Integer, default=1)
    experience_level = Column(String(30), default="Intermediate")  # Beginner, Intermediate, Master
    village_location = Column(String(100), default="Goa")
    contact_phone = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    profile_photo = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessments = relationship("Assessment", back_populates="artisan", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="artisan", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="artisan", cascade="all, delete-orphan")


class SkillCriteria(Base):
    __tablename__ = "skill_criteria"

    id = Column(Integer, primary_key=True, index=True)
    craft_category = Column(String(50), nullable=False, index=True)
    criterion_name = Column(String(100), nullable=False)  # Shape Consistency, Surface Finish, etc.
    description = Column(Text, nullable=False)
    weight = Column(Float, default=0.20)
    benchmark_score = Column(Float, default=8.5)  # Target master score out of 10.0


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=False)
    craft_category = Column(String(50), nullable=False)
    craft_title = Column(String(150), default="Artisan Craft Submission")
    image_url = Column(String(300), nullable=True)

    # 5 Visible Rubric Criteria (1.0 to 10.0 scale)
    shape_consistency = Column(Float, nullable=False)
    surface_finish = Column(Float, nullable=False)
    pattern_consistency = Column(Float, nullable=False)
    symmetry = Column(Float, nullable=False)
    detail_quality = Column(Float, nullable=False)

    # Computer Vision measured metrics vs expert evaluated rubric
    cv_metrics = Column(Text, nullable=True)  # JSON-encoded OpenCV analysis metrics
    expert_notes = Column(Text, nullable=True)
    overall_score = Column(Float, nullable=False)
    strengths = Column(Text, nullable=True)  # JSON list
    improvement_areas = Column(Text, nullable=True)  # JSON list
    assessment_date = Column(DateTime, default=datetime.datetime.utcnow)

    artisan = relationship("Artisan", back_populates="assessments")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    craft_category = Column(String(50), nullable=False, index=True)
    difficulty_level = Column(String(30), nullable=False)  # Beginner, Intermediate, Advanced
    skill_focus = Column(String(50), nullable=False)       # Symmetry, Surface Finish, etc.
    description = Column(Text, nullable=False)
    traditional_master_notes = Column(Text, nullable=True)
    practical_exercises = Column(Text, nullable=True)      # JSON list of exercises
    learning_sequence_order = Column(Integer, default=1)
    estimated_hours = Column(Integer, default=4)

    recommendations = relationship("Recommendation", back_populates="course")
    learning_progress = relationship("LearningProgress", back_populates="course")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    priority_rank = Column(Integer, default=1)
    identified_gap = Column(Float, default=0.0)
    rationale = Column(Text, nullable=False)
    status = Column(String(30), default="Recommended")  # Recommended, Enrolled, Completed
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    artisan = relationship("Artisan", back_populates="recommendations")
    course = relationship("Course", back_populates="recommendations")


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status = Column(String(30), default="In Progress")
    completion_percentage = Column(Integer, default=0)
    completed_exercises = Column(Text, nullable=True)  # JSON list
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    artisan = relationship("Artisan", back_populates="learning_progress")
    course = relationship("Course", back_populates="learning_progress")


class ImageRecord(Base):
    __tablename__ = "image_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(200), nullable=False)
    original_filename = Column(String(200), nullable=False)
    file_path = Column(String(300), nullable=False)
    craft_category = Column(String(50), nullable=True)
    feature_embedding = Column(Text, nullable=True)  # JSON list
    file_size_kb = Column(Float, nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String(50), nullable=False)  # RECOGNITION, ASSESSMENT, ARCHIVE, RECOMMENDATION
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    related_entity_type = Column(String(50), nullable=True)
    related_entity_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
