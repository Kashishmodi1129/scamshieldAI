import os
from ..config import UPLOAD_DIR

async def extract_text_from_image(file_path: str) -> str:
    try:
        import pytesseract
        from PIL import Image
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text.strip() or "No text detected in image."
    except ImportError:
        try:
            import easyocr
            reader = easyocr.Reader(['en'], gpu=False)
            result = reader.readtext(file_path)
            return " ".join([item[1] for item in result]) or "No text detected."
        except ImportError:
            return "OCR libraries not installed. Install pytesseract or easyocr."

async def save_upload(file) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, file.filename or "screenshot.png")
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    return path
