from sqlalchemy import Column, Integer, String, Text
from ..database import Base

class DeveloperSettings(Base):
    __tablename__ = "developer_settings"

    id = Column(Integer, primary_key=True, index=True, default=1)
    provider = Column(String, default="groq")
    api_key_encrypted = Column(Text, default="")
    selected_model = Column(String, default="llama-3.3-70b-versatile")
    detection_mode = Column(String, default="balanced")
    confidence_threshold = Column(Integer, default=70)
    custom_prompt = Column(Text, default="You are an expert cybersecurity analyst specializing in scam detection. Analyze conversations and return risk score, scam category, scam tactics, flagged messages, explanation, and prevention advice.")
