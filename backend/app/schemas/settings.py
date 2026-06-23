from pydantic import BaseModel

class SettingsIn(BaseModel):
    provider: str | None = None
    api_key: str | None = None
    selected_model: str | None = None
    detection_mode: str | None = None
    confidence_threshold: int | None = None
    custom_prompt: str | None = None

class SettingsOut(BaseModel):
    provider: str
    api_key: str
    selected_model: str
    detection_mode: str
    confidence_threshold: int
    custom_prompt: str

class TestConnectionRequest(BaseModel):
    provider: str
    api_key: str
    model: str

class TestConnectionResponse(BaseModel):
    success: bool
    message: str
