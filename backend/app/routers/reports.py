import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.report import Report
from ..schemas.report import ReportOut, FlaggedMessage

router = APIRouter()

def report_to_out(r: Report) -> ReportOut:
    return ReportOut(
        id=r.id,
        conversation=r.conversation,
        risk_score=r.risk_score,
        risk_level=r.risk_level,
        category=r.category or "",
        tactics=json.loads(r.tactics or "[]"),
        flagged_messages=[FlaggedMessage(**m) for m in json.loads(r.flagged_messages or "[]")],
        explanation=r.explanation or "",
        recommendations=json.loads(r.recommendations or "[]"),
        created_at=r.created_at,
    )

@router.get("/reports", response_model=list[ReportOut])
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return [report_to_out(r) for r in reports]

@router.get("/reports/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report_to_out(report)

@router.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"ok": True}
