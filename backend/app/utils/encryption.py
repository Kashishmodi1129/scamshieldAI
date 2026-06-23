from cryptography.fernet import Fernet
import base64, hashlib
from ..config import ENCRYPTION_KEY

def _get_cipher():
    key = base64.urlsafe_b64encode(hashlib.sha256(ENCRYPTION_KEY.encode()).digest())
    return Fernet(key)

def encrypt(plain: str) -> str:
    if not plain:
        return ""
    return _get_cipher().encrypt(plain.encode()).decode()

def decrypt(cipher: str) -> str:
    if not cipher:
        return ""
    try:
        return _get_cipher().decrypt(cipher.encode()).decode()
    except Exception:
        return ""
