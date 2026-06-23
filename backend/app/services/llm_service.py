import json
from groq import Groq
from ..utils.encryption import decrypt

FRAUD_ANALYST_PROMPT = """You are a senior cybersecurity fraud analyst at a financial crimes investigation unit.

Your ONLY job is to identify scams, social engineering attempts, credential theft, impersonation attacks, banking fraud, phishing, and payment fraud.

## CRITICAL HIGH-RISK SIGNALS (must increase risk significantly):
- Requests for OTPs, verification codes, authentication codes
- Requests for banking credentials, UPI PINs, passwords, or login details
- Direct payment/transfer/money requests — especially with urgency
- Claims of winning prizes that require upfront payment
- QR code scan requests for payment
- Account suspension threats demanding immediate action
- Fake KYC/Aadhaar/ITR update links

## CONTEXT ANALYSIS (critical):
- "Can you send me your OTP?" → INTENT is credential harvesting = HIGH RISK
- "Do not share your OTP with anyone" → INTENT is safety advice = LOW RISK
- "My OTP is not arriving" → INTENT is user reporting issue = LOW RISK
- "Pay ₹500 to claim your prize" → INTENT is advance-fee scam = HIGH RISK
- "Let's meet tomorrow at 5PM" → INTENT is genuine = SAFE

Analyze: intent, urgency, social engineering tactics, fear/authority pressure, financial pressure, trust-building attempts, manipulation.

## JSON OUTPUT FORMAT:
{
  "risk_score": <0-100>,
  "risk_level": "<Safe|Likely Safe|Suspicious|High Risk>",
  "category": "<Scam category or empty string>",
  "tactics": ["<tactic1>", "<tactic2>"],
  "flagged_messages": [{"text": "...", "reason": "...", "severity": "low|medium|high"}],
  "confidence": <0.0-1.0>,
  "explanation": "<detailed analysis>",
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}

If you are uncertain, set confidence LOW (< 0.5) and risk_level to "Likely Safe". Never confidently call something "Safe" when you are unsure."""

def get_client(api_key_encrypted: str):
    key = decrypt(api_key_encrypted)
    if not key:
        return None
    return Groq(api_key=key)

def analyze_with_llm(conversation: str, api_key_encrypted: str, model: str, custom_prompt: str | None = None):
    client = get_client(api_key_encrypted)
    if not client:
        return None

    prompt = custom_prompt or FRAUD_ANALYST_PROMPT

    system_msg = {
        "role": "system",
        "content": prompt,
    }

    user_msg = {
        "role": "user",
        "content": f"Analyze this conversation for scam indicators. Return ONLY valid JSON:\n\n{conversation}",
    }

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[system_msg, user_msg],
            temperature=0.1,
            max_tokens=1200,
        )
        content = completion.choices[0].message.content.strip()

        # Extract JSON from response
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        content = content.strip()

        result = json.loads(content)

        # Ensure required fields exist
        result.setdefault("risk_score", 50)
        result.setdefault("risk_level", "Suspicious")
        result.setdefault("category", "")
        result.setdefault("tactics", [])
        result.setdefault("flagged_messages", [])
        result.setdefault("confidence", 0.5)
        result.setdefault("explanation", "")
        result.setdefault("recommendations", [])

        return result
    except Exception:
        return None


def test_connection(api_key: str, model: str) -> tuple[bool, str]:
    try:
        client = Groq(api_key=api_key)
        client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5,
        )
        return True, f"Successfully connected to Groq with model '{model}'."
    except Exception as e:
        return False, str(e)
