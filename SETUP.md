# CraftSphere AI – Setup & Installation Guide

**Goa AI Hackathon 2026 – Artisan Development Theme**

This guide provides clear, beginner-friendly instructions to set up and run the CraftSphere AI platform on Windows 11.

---

## 1. Prerequisites

Before getting started, make sure your laptop has:
- **Windows 11**
- **Python 3.10+** (Tested up to Python 3.14)
- **Node.js 18+** (Node v20+ recommended)
- **Git** (optional, for version tracking)

---

## 2. Quick Start (Automated One-Click Launch)

If you have already installed the dependencies:

Simply double-click:
```bat
start_project.bat
```
This script will:
1. Verify Python & Node.js environments.
2. Initialize and seed the SQLite database (`craftsphere.db`).
3. Start the FastAPI backend on `http://localhost:8000`.
4. Start the React development server on `http://localhost:5173`.
5. Open interactive Swagger API docs at `http://localhost:8000/docs`.

---

## 3. Manual Step-by-Step Installation

If you are setting up the project for the first time:

### Step 3.1: Install Backend Dependencies
Open PowerShell or Command Prompt in the `CraftSphereAI` root directory:

```bash
# (Optional) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate

# Install required backend packages
pip install -r backend/requirements.txt
```

### Step 3.2: Initialize the Database & Seed Records
Populate the database with authentic Goan cultural craft records, master criteria, courses, and sample artisans:

```bash
python backend/seed_data.py
```

### Step 3.3: Initialize the Dataset & Train MobileNetV2 Model
Run the automated computer vision dataset preparation and transfer learning fine-tuning:

```bash
# 1. Generate stratified craft dataset samples
python scripts/init_dataset.py

# 2. Run deduplication & 70/15/15 train/val/test split
python scripts/dataset_pipeline.py

# 3. Fine-tune MobileNetV2 transfer learning model
python backend/ai_models/train_classifier.py
```

### Step 3.4: Install Frontend Dependencies
Navigate to the `frontend` folder and install dependencies:

```bash
cd frontend
npm install
cd ..
```

---

## 4. Running the Servers Manually

### Start Backend (Terminal 1):
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Health: `http://localhost:8000/api/health`
- Swagger Docs: `http://localhost:8000/docs`

### Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 5. Running Automated Backend Tests

We use `pytest` to verify all endpoints, database CRUD, and ML algorithms:

```bash
pytest tests/ -v
```
All 9 unit and integration tests will execute and report passing results.

---

## 6. Architecture & Port Reference

| Service | Port / URL | Description |
| :--- | :--- | :--- |
| **Frontend UI** | `http://localhost:5173` | React 19 + Tailwind CSS v4 web app |
| **Backend API** | `http://localhost:8000` | FastAPI REST services |
| **Swagger UI** | `http://localhost:8000/docs` | Interactive OpenAPI documentation |
| **ReDoc UI** | `http://localhost:8000/redoc` | Alternative API reference |
| **Database** | `backend/craftsphere.db` | Local SQLite database |

