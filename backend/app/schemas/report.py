from pydantic import BaseModel
from datetime import datetime

class FlaggedMessage(BaseModel):
    text: str
    reason: str
    severity: str

class ReportOut(BaseModel):
    id: int
    conversation: str
    risk_score: int
    risk_level: str
    category: str
    tactics: list[str]
    flagged_messages: list[FlaggedMessage]
    explanation: str
    recommendations: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}
