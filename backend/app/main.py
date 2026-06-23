import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, get_db, Base
from .models.report import Report
from .models.settings import DeveloperSettings
from .routers import analyze, reports, upload, settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="ScamShield AI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api", tags=["Analyze"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(settings.router, prefix="/api", tags=["Settings"])

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return {
        "total_analyses": len(reports),
        "safe_count": sum(1 for r in reports if r.risk_level == "Safe"),
        "suspicious_count": sum(1 for r in reports if r.risk_level == "Suspicious"),
        "high_risk_count": sum(1 for r in reports if r.risk_level == "High Risk"),
        "recent_analyses": [
            {
                "id": r.id,
                "conversation": r.conversation,
                "risk_score": r.risk_score,
                "risk_level": r.risk_level,
                "category": r.category or "",
                "tactics": json.loads(r.tactics or "[]"),
                "flagged_messages": json.loads(r.flagged_messages or "[]"),
                "explanation": r.explanation or "",
                "recommendations": json.loads(r.recommendations or "[]"),
                "created_at": r.created_at.isoformat() if r.created_at else "",
            }
            for r in sorted(reports, key=lambda x: x.created_at or "", reverse=True)[:10]
        ],
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
