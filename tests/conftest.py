import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from database import SessionLocal, Base, engine


@pytest.fixture(scope="session")
def client():
    """Provides a TestClient for FastAPI endpoints."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def db_session():
    """Provides a database session for testing."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

