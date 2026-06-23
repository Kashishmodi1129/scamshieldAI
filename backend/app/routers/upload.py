from fastapi import APIRouter, UploadFile, File
from ..services.ocr_service import save_upload, extract_text_from_image

router = APIRouter()

@router.post("/upload")
async def upload_screenshot(file: UploadFile = File(...)):
    path = await save_upload(file)
    text = await extract_text_from_image(path)
    return {"text": text, "file": file.filename}
