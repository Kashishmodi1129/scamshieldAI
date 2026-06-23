from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.settings import DeveloperSettings
from ..schemas.settings import SettingsIn, SettingsOut, TestConnectionRequest, TestConnectionResponse
from ..utils.encryption import encrypt, decrypt
from ..services.llm_service import test_connection

router = APIRouter()

@router.get("/developer/settings", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(DeveloperSettings).first()
    if not settings:
        settings = DeveloperSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return SettingsOut(
        provider=settings.provider,
        api_key=decrypt(settings.api_key_encrypted),
        selected_model=settings.selected_model,
        detection_mode=settings.detection_mode,
        confidence_threshold=settings.confidence_threshold,
        custom_prompt=settings.custom_prompt,
    )

@router.post("/developer/settings", response_model=SettingsOut)
def save_settings(data: SettingsIn, db: Session = Depends(get_db)):
    settings = db.query(DeveloperSettings).first()
    if not settings:
        settings = DeveloperSettings()
        db.add(settings)

    if data.provider is not None:
        settings.provider = data.provider
    if data.api_key is not None:
        settings.api_key_encrypted = encrypt(data.api_key)
    if data.selected_model is not None:
        settings.selected_model = data.selected_model
    if data.detection_mode is not None:
        settings.detection_mode = data.detection_mode
    if data.confidence_threshold is not None:
        settings.confidence_threshold = data.confidence_threshold
    if data.custom_prompt is not None:
        settings.custom_prompt = data.custom_prompt

    db.commit()
    db.refresh(settings)

    return SettingsOut(
        provider=settings.provider,
        api_key=decrypt(settings.api_key_encrypted),
        selected_model=settings.selected_model,
        detection_mode=settings.detection_mode,
        confidence_threshold=settings.confidence_threshold,
        custom_prompt=settings.custom_prompt,
    )

@router.post("/developer/test-connection", response_model=TestConnectionResponse)
def test_api_connection(data: TestConnectionRequest):
    success, message = test_connection(data.api_key, data.model)
    return TestConnectionResponse(success=success, message=message)
