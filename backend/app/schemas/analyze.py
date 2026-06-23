from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    conversation: str

class FlaggedMessage(BaseModel):
    text: str
    reason: str
    severity: str

class LinkCheckResult(BaseModel):
    name: str
    passed: bool
    detail: str

class LinkAnalysisResult(BaseModel):
    url: str
    domain: str
    risk_score: int
    risk_level: str
    is_shortened: bool
    checks: list[LinkCheckResult]
    ai_explanation: str | None = None
    ai_risk_score: int | None = None
    ai_confidence: float | None = None
    ai_tactics: list[str] | None = None
    ai_recommendations: list[str] | None = None

class AnalysisResult(BaseModel):
    risk_score: int
    risk_level: str
    category: str
    tactics: list[str]
    flagged_messages: list[FlaggedMessage]
    explanation: str
    recommendations: list[str]
    is_fallback: bool = False
    confidence: float = 0.0
    link_analysis: list[LinkAnalysisResult] | None = None

class AnalyzeResponse(BaseModel):
    result: AnalysisResult
    report_id: int

class LinkAnalyzeRequest(BaseModel):
    url: str
    use_ai: bool = False

class LinkAnalyzeResponse(BaseModel):
    link_analysis: LinkAnalysisResult
