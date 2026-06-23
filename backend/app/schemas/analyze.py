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

class LinkAnalyzeResponse(BaseModel):
    link_analysis: LinkAnalysisResult
