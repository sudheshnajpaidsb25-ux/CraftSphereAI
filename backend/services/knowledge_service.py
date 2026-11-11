import re
import numpy as np
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models import Craft, Course
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def query_heritage_knowledge(query: str, db: Session, top_k: int = 3) -> Dict[str, Any]:
    """
    Retrieval-based Heritage Knowledge Assistant.
    Searches across verified craft records, materials, historical contexts,
    and traditional techniques using TF-IDF term-matching and cosine scoring.
    """
    clean_query = query.strip()
    if not clean_query:
        return {
            "query": query,
            "answer": "Please ask a question regarding Goan crafts, materials, or traditional techniques.",
            "retrieval_method": "Local TF-IDF Vector Space Retrieval",
            "sources": []
        }

    # Fetch verified crafts and courses
    crafts = db.query(Craft).filter(Craft.is_verified == True).all()
    courses = db.query(Course).all()

    documents = []
    doc_metadata = []

    # Build corpus from verified craft records
    for c in crafts:
        text = (
            f"Craft: {c.name}. Category: {c.category}. Region: {c.region_of_origin}. "
            f"Material: {c.material}. Traditional Technique: {c.traditional_technique}. "
            f"Cultural Context: {c.cultural_description}."
        )
        documents.append(text)
        doc_metadata.append({
            "title": c.name,
            "category": c.category,
            "region": c.region_of_origin,
            "excerpt": c.cultural_description[:240] + ("..." if len(c.cultural_description) > 240 else ""),
            "technique": c.traditional_technique,
            "material": c.material,
            "source_reference": c.source_reference or "Directorate of Art & Culture, Government of Goa"
        })

    # Add course modules to corpus for pedagogical questions
    for crs in courses:
        text = (
            f"Training Module: {crs.title}. Craft: {crs.craft_category}. Difficulty: {crs.difficulty_level}. "
            f"Skill Focus: {crs.skill_focus}. Description: {crs.description}. Master Notes: {crs.traditional_master_notes or ''}"
        )
        documents.append(text)
        doc_metadata.append({
            "title": f"Master Guide: {crs.title}",
            "category": crs.craft_category,
            "region": "Artisan Guild Training Curriculum",
            "excerpt": crs.description[:240] + "...",
            "technique": f"Focus on {crs.skill_focus}",
            "material": crs.difficulty_level,
            "source_reference": "CraftSphere AI Artisan Development Guild"
        })

    if not documents:
        return {
            "query": query,
            "answer": "The heritage archive currently has no indexed records to search.",
            "retrieval_method": "Local TF-IDF Vector Space Retrieval",
            "sources": []
        }

    # Fit TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, ngram_range=(1, 2))
    corpus_matrix = vectorizer.fit_transform(documents)
    query_vec = vectorizer.transform([clean_query])

    sim_scores = cosine_similarity(query_vec, corpus_matrix).flatten()
    top_indices = np.argsort(sim_scores)[::-1]

    # Collect matches
    sources = []
    for idx in top_indices[:top_k]:
        score = float(sim_scores[idx])
        if score > 0.05:  # relevance threshold
            meta = doc_metadata[idx]
            meta["relevance_score"] = round(score, 3)
            sources.append(meta)

    # Formulate transparent answer based on retrieval results
    if sources:
        top_match = sources[0]
        answer_parts = [
            f"Based on verified Goan cultural records for **{top_match['title']}** ({top_match['category']}):",
            f"\n• **Traditional Materials & Technique**: Utilizes {top_match['material']} through {top_match['technique']}.",
            f"• **Cultural Context & Region**: Associated with {top_match['region']}.",
            f"• **Archive Summary**: \"{top_match['excerpt']}\""
        ]

        if len(sources) > 1:
            second = sources[1]
            answer_parts.append(
                f"\nAdditionally related: **{second['title']}** highlights traditional practice in {second['region']}."
            )

        answer = "\n".join(answer_parts)
    else:
        answer = (
            f"No verified archive records directly matched the query \"{clean_query}\". "
            f"The CraftSphere AI verified archive currently focuses on Goan Pottery (Bicholim), "
            f"Bamboo and Cane (Valpoi/Sattari), Handloom Kunbi Weaving (Ponda/Canacona), and "
            f"Sacred Wood Carving (Cuncolim). Please refine your keywords."
        )

    return {
        "query": query,
        "answer": answer,
        "retrieval_method": "Local TF-IDF Information Retrieval (Deterministic & Factual)",
        "sources": sources
    }

