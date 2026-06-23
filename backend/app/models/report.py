from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    conversation = Column(Text, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    category = Column(String, default="")
    tactics = Column(Text, default="[]")
    flagged_messages = Column(Text, default="[]")
    explanation = Column(Text, default="")
    recommendations = Column(Text, default="[]")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
