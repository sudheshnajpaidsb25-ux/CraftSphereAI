# CraftSphere AI

### Intelligent Cultural Heritage Preservation and Artisan Development Platform
**Goa AI Hackathon 2026 – Artisan Development Theme**

---

## 1. Project Overview & Vision

Traditional Goan crafts represent centuries of indigenous ecological knowledge, architectural mastery, and tribal identity—from the heat-resistant alluvial red clay *kundlem* pottery of **Bicholim**, to the sacred high-relief teakwood carvings of **Cuncolim**, the wild mountain bamboo *sup* winnowing fans of **Valpoi/Sattari**, and the historic checkered cotton handloom sarees of the indigenous **Kunbi** community.

**CraftSphere AI** is a fully functional, integrated platform built from scratch to digitally preserve Goan craftsmanship and provide transparent, AI-driven development pathways for artisans.

### Core Capabilities:
1. **Digital Cultural Heritage Preservation**: Searchable archive with verified provenance, licensing, and material taxonomy.
2. **AI-Based Craft & Pattern Recognition**: Fine-tuned MobileNetV2 transfer learning model classifying craft families with confidence scores and prototype fallback.
3. **Pattern Intelligence**: 128-dimensional spatial and gradient vector embeddings compared via cosine similarity.
4. **Artisan Skill Assessment & Skill Gap Analysis**: 5-criterion standardized rubric paired with optical computer-vision symmetry and surface roughness measurements.
5. **Personalized Training Recommendations**: Content-based curriculum mapping that suggests targeted master modules and step-by-step practical exercises.
6. **Heritage Knowledge Assistant**: Deterministic local TF-IDF retrieval answering artisan queries with cited factual archives.

---

## 2. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React Icons, Recharts (Radar, Pie, Bar, Line).
- **Backend**: Python 3.14, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2.1.
- **Database**: SQLite (`backend/craftsphere.db`) with 9 interlinked relational tables and automatic seeding.
- **AI & Computer Vision**: MobileNetV2 transfer learning (PyTorch / Torchvision), OpenCV, NumPy, Scikit-learn (TF-IDF & metrics), PIL.
- **Testing**: PyTest automated test suite with 100% passing module coverage.

---

## 3. Seven Integrated Modules

### Module 1: AI Craft Recognition
- **Upload Formats**: JPG, JPEG, PNG (validated client & server-side, 10 MB limit).
- **Supported Families**: Pottery, Bamboo and Cane, Handloom, Wood Carving.
- **AI Model**: MobileNetV2 transfer learning fine-tuned on Goan craft dataset (`models/craft_classifier.pt`).
- **Explainability**: Outputs confidence percentage, full class probability distribution, and curated cultural context.
- **Out-of-Scope Handling**: Images with low confidence or non-craft subjects return clear advisory messages.

### Module 2: Pattern Intelligence
- **Feature Extraction**: 128-dimensional multi-scale spatial vector combining 64-bin HSV color distribution, 32-bin Sobel gradient orientations, and 32-bin local texture energy.
- **Vector Metric**: Cosine similarity `cos_sim(u, v) = (u · v) / (||u|| * ||v||)`.
- **Ethical Cultural Disclaimer**: Prominently displays that visual resemblance reflects mathematical texture and geometry, not historical proof of origin.

### Module 3: Digital Heritage Archive
- Search by craft name, raw material, technique, or Goan region.
- Filter by category and verification status (*Verified Goan Heritage* vs. *Unverified Community Review*).
- Full CRUD operations: inspect details, add new craft records, update, and delete.

### Module 4: Artisan Skill Assessment
- Standardized 5-criteria rubric:
  1. **Shape Consistency**
  2. **Surface Finish**
  3. **Pattern Consistency**
  4. **Symmetry & Bilateral Alignment**
  5. **Detail Quality & Precision**
- **Transparent Formula**: Weighted average with equal 20% weights (`overall_score = Σ 0.20 * score_i`).
- **Sensor Separation**: Clearly differentiates optical CV measurements (bilateral mirror difference and Laplacian variance) from expert craftsman evaluations.

### Module 5: Skill Gap Analysis
- Dynamic **Radar Chart** comparing artisan scores against master guild benchmark targets.
- Shortfall progress bars displaying exact point gaps and priority classifications (*High Priority Gap*, *Moderate Gap*, *Target Met*).
- Historical score trajectory line chart tracking progress across successive assessments.

### Module 6: Personalized Training Recommendations
- Content-based recommender matching isolated skill deficits to structured course modules.
- Non-random curriculum mapping with difficulty levels (*Beginner*, *Intermediate*, *Advanced*).
- Step-by-step practical master guild exercises and suggested learning sequences.

### Module 7: Heritage Knowledge Assistant
- Transparent, deterministic TF-IDF term-frequency retrieval over stored verified craft records and traditional courses.
- Answers queries with cited factual archives, relevance scores, and excerpts without generative hallucination.

---

## 4. Database Schema

The SQLite database (`craftsphere.db`) contains 9 relational tables:
1. `crafts`: Cultural heritage records, materials, techniques, and embeddings.
2. `artisans`: Registered artisan profiles, experience years, levels, and village clusters.
3. `skill_criteria`: Master target benchmarks and criterion weights.
4. `assessments`: Submissions, rubric scores, CV metrics, and expert notes.
5. `courses`: Structured learning modules, difficulty levels, and practical exercises.
6. `recommendations`: Prioritized course assignments linked to identified skill gaps.
7. `learning_progress`: Artisan enrollment and exercise completion tracking.
8. `image_records`: Upload metadata, dimensions, and stored paths.
9. `activity_logs`: Real-time system audit logs powering the dashboard feed.

---

## 5. Dataset & Transfer Learning Pipeline

The project includes an end-to-end dataset management pipeline:
- `dataset/images/raw/`: Stratified craft samples across all 4 categories.
- `scripts/init_dataset.py`: Generates representative visual samples with distinct variations.
- `scripts/dataset_pipeline.py`: Validates image integrity, eliminates duplicates via SHA-256 pixel hashing, and creates reproducible 70% Train, 15% Validation, 15% Test splits.
- `backend/ai_models/train_classifier.py`: Fine-tunes MobileNetV2 with data augmentation (rotations, flips, color jitter), saves model weights (`models/craft_classifier.pt`), and outputs classification report, confusion matrix, and metrics (`models/training_metrics.json`).
- `backend/ai_models/evaluate_model.py`: Held-out test split evaluation.

---

## 6. How to Run the Application

### Option A: One-Click Startup (Windows)
Double-click `start_project.bat` in the project root.

### Option B: Manual Startup

**1. Start Backend:**
```bash
cd backend
python seed_data.py
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```

### URLs:
- **Frontend App**: `http://localhost:5173`
- **FastAPI Backend**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

---

## 7. Automated Test Suite

Run backend tests using `pytest`:
```bash
pytest tests/ -v
```
All 9 unit and integration tests execute and pass in under 1 second.

