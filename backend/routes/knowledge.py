from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas import KnowledgeQueryRequest, KnowledgeQueryResponse
from services.knowledge_service import query_heritage_knowledge

router = APIRouter(prefix="/api/knowledge", tags=["Heritage Knowledge Assistant"])


@router.get("/search", response_model=KnowledgeQueryResponse)
def search_knowledge_get(
    query: str = Query(..., min_length=2, max_length=500, description="Question regarding Goan crafts"),
    top_k: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db)
):
    """
    Module 7: Heritage Knowledge Assistant (GET)
    Answers questions using local TF-IDF retrieval over the verified craft archive.
    """
    return query_heritage_knowledge(query, db, top_k=top_k)


@router.post("/search", response_model=KnowledgeQueryResponse)
def search_knowledge_post(
    req: KnowledgeQueryRequest,
    db: Session = Depends(get_db)
):
    """
    Module 7: Heritage Knowledge Assistant (POST)
    """
    return query_heritage_knowledge(req.query, db, top_k=req.top_k)

