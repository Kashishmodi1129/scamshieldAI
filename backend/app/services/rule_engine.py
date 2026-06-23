import re

NEGATION_PREFIXES = [
    r'do\s+not\s+', r'don\'t\s+', r'never\s+', r'avoid\s+', r'donot\s+',
    r'shouldn\'t\s+', r'should\s+not\s+', r'please\s+don\'t\s+',
]
NEGATION_RE = re.compile(
    r'(?:' + '|'.join(NEGATION_PREFIXES) + r')\s*$', re.I
)

def is_negated(text: str, match_start: int) -> bool:
    prefix = text[max(0, match_start - 40):match_start]
    return bool(NEGATION_RE.search(prefix))


# ─── CRITICAL ───
CRITICAL = [
    (re.compile(
        r'(?:send|give|share|provide|forward|tell|what\'?s|need|want|submit|enter|put|type|confirm)\s*'
        r'(?:me|us|the|your)?\s*(?:the|your|my|this|that)?\s*'
        r'(?:otp|one.?time.?pin|verification\s*code|auth(?:entication)?\s*code|'
        r'banking\s*password|upi\s*pin|internet\s*banking\s*password|'
        r'debit\s*card\s*pin|atm\s*pin|password|login\s*details|'
        r'credentials|account\s*details)',
        re.I
    ), 'Direct credential harvesting attempt — OTP/password request', 75, True),

    (re.compile(
        r'(?:pay|send|transfer|remit|deposit|paytm|gpay|phonepay)\s*'
        r'(?:me|us|the|now)?\s*'
        r'(?:₹|rs|rupees|money|cash|amount)\s*'
        r'(?:\d+[\d,.]*)?',
        re.I
    ), 'Direct payment/money transfer request', 65, False),

    (re.compile(
        r'(?:won|winner|prize|lucky|selected|reward|congratulations)\s*'
        r'(?:[^.]{0,40})?\s*'
        r'(?:pay|send|fee|charges?|₹|rs|deposit|processing\s*fee|claim|'
        r'advance|token|registration\s*fee)',
        re.I
    ), 'Prize scam requiring payment to claim', 75, True),

    (re.compile(
        r'(?:scan|pay)\s*(?:this|the|my|below|following|above|this\s*qr)?\s*(?:qr|qr\s*code)',
        re.I
    ), 'QR code payment scan request — common UPI fraud', 65, False),

    (re.compile(
        r'(?:send|transfer|receive|get)\s*(?:me|us)?\s*(?:money|₹|rs|cash|funds?)'
        r'(?:.*?)(?:account|upi|wallet)',
        re.I
    ), 'Financial transfer request to account/UPI', 60, False),
]

# ─── HIGH ───
HIGH = [
    # Account threats
    (re.compile(
        r'(?:your|the|my)\s*(?:\w+\s+)?(?:account|card|banking|wallet|upi|service|access|profile)'
        r'(?:\s+has\s+been|\s+is\s+|\s+will\s+be\s+|\s+)?'
        r'\s*(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)',
        re.I
    ), 'Account frozen/blocked threat — impersonation tactic', 55),

    (re.compile(
        r'(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)'
        r'(?:.{0,30})(?:account|card|banking|wallet|upi)',
        re.I
    ), 'Account action threat language', 55),

    (re.compile(
        r'(?:account|card|banking|wallet|upi|service|access|profile)'
        r'(?:\s+(?:has\s+been|is|will\s+be)\s+)?'
        r'(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)',
        re.I
    ), 'Account/card blocked or restricted threat', 50),

    # KYC/Aadhaar
    (re.compile(
        r'(?:kyc|know.?your.?customer|aadhaar|aadhar|pan.?card|e\-?kyc)'
        r'(?:.{0,20})(?:update|expire|verify|link|complete|fail|pending|required|number)',
        re.I
    ), 'Fake KYC/Aadhaar verification request', 50),

    # Tax refund
    (re.compile(
        r'(?:income.?tax|itr|tax\s*refund|refund\s*amount)'
        r'(?:.{0,30})(?:credit|deposit|claim|link|click|pending)',
        re.I
    ), 'Fake tax refund phishing', 45),

    # OTP sharing context
    (re.compile(
        r'(?:otp|one.?time.?pin|verification\s*code)\s*'
        r'(?:.{0,20})?(?:sent|share|tell|send|give|forward|provide)',
        re.I
    ), 'OTP being requested/sent to victim', 40),

    # UPI/VPA
    (re.compile(
        r'(?:upi|vpa|@paytm|@okhdfc|@okicici|@ybl|@axl|@ibl)',
        re.I
    ), 'UPI ID/VPA detected — potential payment collection', 40),

    # Authority impersonation — NO "ed" substring (was causing false positives)
    (re.compile(
        r'(?:sbi|hdfc|icici|axis\s*bank|bank\s*manager|rbi\b|'
        r'income.?tax\s*(?:dept|office|department)|court|police\s*|cbi\b|'
        r'narcotics|cyber\s*crime\s*(?:cell|branch|dept)|drugs\s*|'
        r'parcel\s*(?:from|contains|with)|fedex|dhl|customs\s*(?:dept|authority))',
        re.I
    ), 'Authority impersonation — common scam tactic', 45),

    # Drug parcel scam (specific well-known India scam pattern)
    (re.compile(
        r'(?:parcel|package|courier).{0,30}(?:drugs|narcotics|cocaine|illegal|contraband)',
        re.I
    ), 'Drug parcel scam — common FedEx/Courier impersonation', 55),

    # Click/sign-in action with URL
    (re.compile(
        r'(?:click|tap|visit|sign\s*in|login|verify|update)\s*'
        r'(?:.{0,20})?\s*(?:to|and|here|now|below)\s*'
        r'(?:verify|update|confirm|login|sign|unlock|reactivate)',
        re.I
    ), 'Suspicious action chain — potential phishing', 35),

    # Action required + URL (broad)
    (re.compile(
        r'(?:click|tap|visit|verify|update|confirm)\s*(?:.{0,30})?\s*'
        r'(?:http|https|www\.)\S+',
        re.I
    ), 'Action request with embedded URL — phishing indicator', 40),

    # Personal info request (broadened to include "need", aadhaar, pan)
    (re.compile(
        r'(?:share|send|provide|give|need|want|submit)\s*(?:me|us|your)?\s*'
        r'(?:the|your)?\s*'
        r'(?:details|info|information|data|bank\s*details|aadhaar|aadhar|pan|'
        r'pan\s*number|aadhaar\s*number|account\s*number)',
        re.I
    ), 'Request for personal/banking information', 40),

    # Combined identity document request (multiple IDs)
    (re.compile(
        r'(?:pan|aadhaar|voter|passport|ssn|itin|driving\s*license)\s*(?:and|&|,)\s*'
        r'(?:pan|aadhaar|voter|passport|ssn|itin|driving\s*license)',
        re.I
    ), 'Request for multiple identity documents — strong fraud indicator', 50),

    # Click suspicious link
    (re.compile(
        r'(?:click|tap|install|download|update|open|tap\s*on)\s*'
        r'(?:this|the|link|url|app|attachment|file|apk|button)',
        re.I
    ), 'Suspicious action request — malware/phishing link', 40),

    # Urgency
    (re.compile(
        r'(?:urgent|immediately|right\s*now|asap|act\s*now|'
        r'limited\s*time|expires?\s*today|last\s*chance|'
        r'hurry|quick|don\'t\s*lose|today\s*only|time\s*running)',
        re.I
    ), 'High-pressure urgency tactic', 35),

    # Fake property scam
    (re.compile(
        r'(?:army|officer|colonel|general|sir|captain|dr|doctor|major|navy)\s*'
        r'(?:transferred|posted|relocated|abroad|out\s*of\s*station|'
        r'serving|deployed)',
        re.I
    ), 'Fake Army/Doctor property scam', 45),

    # Fake refund
    (re.compile(
        r'(?:refund|claim)\s*(?:your|the|of|my)\s*(?:money|amount|₹|rs)\s*(?:\d+|back)',
        re.I
    ), 'Fake refund request — common PhonePe/GPay scam', 40),

    # Phishing link
    (re.compile(
        r'(?:click|visit)\s*(?:the|this|below|following)?\s*(?:link|url)'
        r'(?:.{0,30})(?:verify|update|confirm|login|sign)',
        re.I
    ), 'Phishing link with action request', 45),
]

# ─── MEDIUM ───
MEDIUM = [
    (re.compile(r'\b\d{10}\b'), 'Phone number shared', 15),
    (re.compile(r'(?:http|https|www\.)\S+', re.I), 'URL/link detected', 20),
    (re.compile(r'(?:refund|cashback|bonus|free|offer|discount|gift|voucher|scheme|deal)',
                re.I), 'Too-good-to-be-true offer language', 20),
    (re.compile(r'(?:won|winner|prize|lucky|lottery|selected|congratulations|congrats|'
                r'exclusive|limited\s*offer|lucky\s*winner)',
                re.I), 'Prize/lottery/giveaway language', 25),
    (re.compile(r'(?:account|bank|card|wallet|profile)\s*(?:verify|verification|update|upgrade|confirm)',
                re.I), 'Account verification request', 25),
    (re.compile(r'(?:sign|login|log\s*in|verify|authenticate)\s*(?:now|here|below)',
                re.I), 'Login/authentication prompt', 20),
]

# ─── LOW ───
LOW = [
    (re.compile(r'(?:rate|review|feedback|survey).{0,20}(?:earn|₹|rs|money|gift|reward)',
                re.I), 'Suspicious paid review/survey', 10),
    (re.compile(r'(?:unknown|wrong|missed|random|strange)\s*(?:number|call|message|person|chat)',
                re.I), 'Wrong-number contact — potential pig butchering start', 10),
]

# ─── SAFE CONTEXT ───
SAFE_CONTEXT = [
    (re.compile(
        r'(?:do\s+not|don\'t|never|avoid|donot|shouldn\'t|should\s+not|please\s+don\'t)\s*'
        r'(?:share|give|send|tell|reveal|disclose|provide|forward).{0,30}'
        r'(?:otp|password|pin|details|code|info)',
        re.I
    ), 'Safety advice — warning against sharing credentials', -35),

    (re.compile(
        r'(?:be\s*careful|beware|cautious|watch\s*out|stay\s*safe|be\s*aware|remember)\s*'
        r'(?:of|with|about)?\s*(?:scam|fraud|phishing|fake|cheat)',
        re.I
    ), 'Scam awareness message', -30),

    (re.compile(
        r'(?:never|don\'t|do\s+not)\s*pay\s*(?:any|a|the)?\s*(?:money|fee|amount|charges|₹|rs)',
        re.I
    ), 'Warning against paying — anti-scam advice', -30),

    (re.compile(
        r'(?:my|the|this)\s*(?:otp|password|verification\s*code|pin|code)\s*'
        r'(?:is\s*not\s*(?:arriving|coming|working|received|sending|'
        r'delivered|being\s*sent|going\s*through)|not\s*(?:received|getting|working)|'
        r'(?:hasn\'t|has\s*not|isn\'t|is\s*not)\s*(?:arrived|come|been\s*received|working|sent))',
        re.I
    ), 'User reporting issue receiving OTP — not a scam request', -30),

    (re.compile(
        r'(?:i|we)\s*(?:have\s*)?(?:just\s*)?(?:received|got|gotten)\s*(?:an?\s*)?'
        r'(?:otp|password|code|verification\s*code)',
        re.I
    ), 'User stating they received an OTP — passive statement', -15),

    (re.compile(
        r'thank\s*(?:you|s|u|you\s*for|you\s*so\s*much).{0,40}(?:otp|code|password|help|info)',
        re.I
    ), 'Thanking for legitimate service delivery', -20),

    (re.compile(
        r'(?:yes|ok|sure|okay|fine|got\s*it|received)\s*(?:.{0,30})?\s*'
        r'(?:thanks|thank\s*you|sent|received|done)',
        re.I
    ), 'Acknowledgment — not a scam request', -10),
]


def analyze_with_rules(text: str):
    flagged = []
    score = 0
    has_critical = False
    has_otp_request = False

    for pattern, reason, points, check_negation in CRITICAL:
        for m in pattern.finditer(text):
            if check_negation and is_negated(text, m.start()):
                continue
            flagged.append({"text": m.group(), "reason": reason, "severity": "critical"})
            score += points
            has_critical = True
            if 'otp' in reason.lower() or 'password' in reason.lower() or 'credential' in reason.lower():
                has_otp_request = True
            break

    for pattern, reason, points in HIGH:
        m = pattern.search(text)
        if m:
            flagged.append({"text": m.group(), "reason": reason, "severity": "high"})
            score += points

    for pattern, reason, points in MEDIUM:
        m = pattern.search(text)
        if m:
            flagged.append({"text": m.group(), "reason": reason, "severity": "medium"})
            score += points

    for pattern, reason, points in LOW:
        m = pattern.search(text)
        if m:
            flagged.append({"text": m.group(), "reason": reason, "severity": "low"})
            score += points

    for pattern, reason, reduction in SAFE_CONTEXT:
        m = pattern.search(text)
        if m:
            flagged.append({"text": m.group(), "reason": reason, "severity": "safe_context"})
            score += reduction

    if has_otp_request:
        score = max(score, 80)
    elif has_critical:
        score = max(score, 60)

    score = max(0, min(score, 100))

    return score, flagged


def get_risk_level(score: int, threshold: int) -> str:
    if score >= threshold:
        return "High Risk"
    if score >= threshold * 0.65:
        return "Suspicious"
    if score >= threshold * 0.3:
        return "Likely Safe"
    return "Safe"
