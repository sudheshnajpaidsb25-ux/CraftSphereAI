import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, SessionLocal
from seed_data import seed_database

# Import routers
from routes import (
    dashboard,
    crafts,
    recognition,
    patterns,
    artisans,
    assessments,
    recommendations,
    knowledge
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Auto-seed initial Goan cultural heritage data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="CraftSphere AI API",
    description=(
        "Intelligent Cultural Heritage Preservation and Artisan Development Platform. "
        "Engineered for the Goa AI Hackathon 2026 – Artisan Development Theme."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory static mounting
UPLOAD_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_ROOT, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_ROOT, "crafts"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_ROOT, "recognition"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_ROOT, "patterns"), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_ROOT), name="uploads")

# Include API Routers
app.include_router(dashboard.router)
app.include_router(crafts.router)
app.include_router(recognition.router)
app.include_router(patterns.router)
app.include_router(artisans.router)
app.include_router(assessments.router)
app.include_router(recommendations.router)
app.include_router(knowledge.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to CraftSphere AI Platform API",
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health",
        "dashboard": "/api/dashboard"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

