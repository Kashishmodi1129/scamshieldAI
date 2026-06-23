import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.report import Report
from ..models.settings import DeveloperSettings
from ..schemas.analyze import (
    AnalyzeRequest, AnalyzeResponse, AnalysisResult, FlaggedMessage,
    LinkAnalyzeRequest, LinkAnalyzeResponse, LinkAnalysisResult, LinkCheckResult,
)
from ..services.scoring_engine import compute_final_score
from ..services.llm_service import analyze_with_llm
from ..services.link_analysis import analyze_url
from ..utils.encryption import decrypt

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_conversation(req: AnalyzeRequest, db: Session = Depends(get_db)):
    settings = db.query(DeveloperSettings).first()
    llm_result = None

    if settings and settings.detection_mode in ("balanced", "deep") and settings.api_key_encrypted:
        key = decrypt(settings.api_key_encrypted)
        if key:
            llm_result = analyze_with_llm(
                req.conversation,
                settings.api_key_encrypted,
                settings.selected_model,
                settings.custom_prompt,
            )

    threshold = settings.confidence_threshold if settings else 70
    mode = settings.detection_mode if settings else "balanced"

    result = compute_final_score(req.conversation, llm_result, mode, threshold)

    link_analysis_data = None
    if result.get("link_analysis"):
        link_analysis_data = [
            LinkAnalysisResult(
                url=la["url"],
                domain=la["domain"],
                risk_score=la["risk_score"],
                risk_level=la["risk_level"],
                is_shortened=la["is_shortened"],
                checks=[LinkCheckResult(**c) for c in la["checks"]],
            )
            for la in result["link_analysis"]
        ]

    report = Report(
        conversation=req.conversation,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        category=result["category"],
        tactics=json.dumps(result["tactics"]),
        flagged_messages=json.dumps(result["flagged_messages"]),
        explanation=result["explanation"],
        recommendations=json.dumps(result["recommendations"]),
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return AnalyzeResponse(
        result=AnalysisResult(
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            category=result["category"],
            tactics=result["tactics"],
            flagged_messages=[FlaggedMessage(**m) for m in result["flagged_messages"]],
            explanation=result["explanation"],
            recommendations=result["recommendations"],
            is_fallback=result.get("is_fallback", False),
            confidence=result.get("confidence", 0.0),
            link_analysis=link_analysis_data,
        ),
        report_id=report.id,
    )


@router.post("/analyze-link", response_model=LinkAnalyzeResponse)
def analyze_single_link(req: LinkAnalyzeRequest, db: Session = Depends(get_db)):
    result = analyze_url(req.url)

    ai_explanation = None
    ai_risk_score = None
    ai_confidence = None
    ai_tactics = None
    ai_recommendations = None

    if req.use_ai:
        settings = db.query(DeveloperSettings).first()
        if settings and settings.api_key_encrypted:
            key = decrypt(settings.api_key_encrypted)
            if key:
                url_prompt = (
                    settings.custom_prompt
                    or "You are a senior cybersecurity analyst specializing in phishing and scam URLs. "
                       "Analyze the following URL for scam indicators — typosquatting, phishing patterns, "
                       "social engineering tactics, suspicious redirects, credential harvesting, etc. "
                       "Return ONLY valid JSON with: risk_score (0-100), risk_level, category, "
                       "tactics (list), explanation (detailed analysis), recommendations (list)."
                )
                llm_result = analyze_with_llm(
                    f"[URL TO ANALYZE]: {req.url}",
                    settings.api_key_encrypted,
                    settings.selected_model,
                    url_prompt,
                )
                if llm_result:
                    ai_explanation = llm_result.get("explanation")
                    ai_risk_score = llm_result.get("risk_score")
                    ai_confidence = llm_result.get("confidence")
                    ai_tactics = llm_result.get("tactics", [])
                    ai_recommendations = llm_result.get("recommendations", [])

    return LinkAnalyzeResponse(
        link_analysis=LinkAnalysisResult(
            url=result["url"],
            domain=result["domain"],
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            is_shortened=result["is_shortened"],
            checks=[LinkCheckResult(**c) for c in result["checks"]],
            ai_explanation=ai_explanation,
            ai_risk_score=ai_risk_score,
            ai_confidence=ai_confidence,
            ai_tactics=ai_tactics,
            ai_recommendations=ai_recommendations,
        )
    )
