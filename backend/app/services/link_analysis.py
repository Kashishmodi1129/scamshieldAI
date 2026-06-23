import re
from urllib.parse import urlparse

URL_RE = re.compile(r'https?://[^\s<>"\']+|www\.[^\s<>"\']+', re.I)

SHORTENERS = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'shorturl.at', 'rb.gy', 'cutt.ly', 'shorte.st', 'adf.ly', 'bc.vc',
    'tiny.cc', 'bl.ink', 's.id', 'rebrandly', 'cllk.am', 'v.gd', 'u.bb',
    'short.link', 'zip.net', 'shrinke.me', 'tiny.ie', 'hit.my', '1url.com',
    'short.cm', 'short.gy', 'surl.li', 'dub.sh', 'urlz.ee', 'gg.gg',
    'shorturl.ac', 'soo.gd', 'lnkd.in', 'po.st', 'rlu.ru', 'stfly.me',
    'qr.ae', 'shorl.com', 't2m.io', 'x.co', 'mgnet.me',
}

SUSPICIOUS_TLDS = {
    'tk', 'ml', 'cf', 'ga', 'gq', 'xyz', 'top', 'loan', 'click', 'download',
    'gdn', 'bid', 'date', 'win', 'men', 'review', 'trade', 'webcam',
    'science', 'party', 'racing', 'accountant', 'work', 'stream', 'gb',
    'jet', 'sbs', 'lol', 'mom', 'uno', 'rip', 'dog', 'space', 'pics',
    'country', 'kim', 'cool', 'today', 'info', 'pro', 'site', 'icu',
    'cyou', 'monster', 'rest', 'faith', 'peanut',
    'porn', 'sex', 'adult', 'dating', 'cricket',
}

PHISHING_KEYWORDS = {
    'login', 'signin', 'sign-in', 'verify', 'secure', 'update', 'reset',
    'recover', 'authenticate', 'confirm', 'activate', 'validate', 'kyc',
    'aadhaar', 'aadhar', 'pan', 'e-kyc', 'ekyc', 'otp', 'password',
    'payment', 'wallet', 'banking', 'account', 'authorize', 'sso',
    '2fa', 'two-factor', 'credential', 'token', 'reissue', 'unlock',
    'alert', 'security', 'protect', 'suspended', 'blocked', 'restricted',
    'reactivate', 'verification', 'upi', 'gpay', 'phonepay', 'paytm',
    'netbanking', 'internet-banking', 'support', 'help', 'refund',
    'claim', 'reward', 'prize', 'lottery', 'cashback', 'bonus',
}

KNOWN_PHISHING_DOMAINS = {
    'sbi-secure.com', 'sbi-update.com', 'sbi-verify.com',
    'hdfc-banking.com', 'hdfc-secure.com', 'hdfcverify.com',
    'icici-bank.net', 'icici-update.com', 'axisverify.com',
    'paytm-offer.com', 'paytm-cashback.com', 'paytm-verify.com',
    'gpay-reward.com', 'gpay-cashback.com', 'phonepe-offer.com',
    'whatsapp-web-verify.com', 'whatsapp-update.com',
    'whatsappdownload.com', 'telegram-verify.com',
    'insta-verify.com', 'insta-update.com',
    'aadhaar-update.com', 'aadhaar-verify.net', 'e-kyc.link',
    'pan-card-verify.com', 'pan-update.net', 'income-tax-refund.com',
    'itr-filing.net', 'tax-refund-claim.com',
    'courier-delivery.com', 'dhl-india.com', 'fedex-delivery.com',
    'parcel-tracking.com', 'amazon-offer.in', 'amazon-claim.com',
    'flipkart-offer.com', 'flipkart-gift.com',
    'olx-buyer.com', 'olx-seller.com', 'nobroker-find.com',
    'lic-refund.com', 'lic-policy.com', 'epfo-update.com',
    'govt-scheme.com', 'pm-kisan.com', 'pm-sym.com',
    'upi-limit.com', 'wallet-verify.com', 'bankalert.info',
    'imps-refund.com', 'neft-fail.com',
}

BRAND_DOMAINS = {
    'google.com': 'Google', 'gmail.com': 'Gmail', 'youtube.com': 'YouTube',
    'facebook.com': 'Facebook', 'instagram.com': 'Instagram',
    'amazon.com': 'Amazon', 'amazon.in': 'Amazon',
    'flipkart.com': 'Flipkart', 'paytm.com': 'Paytm', 'paypal.com': 'PayPal',
    'whatsapp.com': 'WhatsApp', 'telegram.org': 'Telegram',
    'netflix.com': 'Netflix', 'twitter.com': 'Twitter', 'x.com': 'X',
    'linkedin.com': 'LinkedIn', 'microsoft.com': 'Microsoft',
    'apple.com': 'Apple', 'sbi.co.in': 'SBI',
    'hdfcbank.com': 'HDFC Bank', 'icicibank.com': 'ICICI Bank',
    'axisbank.com': 'Axis Bank',
    'onlinesbi.com': 'SBI Online', 'netbanking.hdfcbank.com': 'HDFC NetBanking',
    'gpay.com': 'Google Pay', 'phonepe.com': 'PhonePe',
    'nobroker.in': 'NoBroker', 'olx.in': 'OLX',
    'rbiorg.in': 'RBI', 'epfindia.gov.in': 'EPFO',
    'incometaxindia.gov.in': 'Income Tax India',
}


def levenshtein(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i - 1][j - 1] if a[i - 1] == b[j - 1] else 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]


def normalize_for_levenshtein(domain: str) -> str:
    return re.sub(r'[.\-_]', '', domain).lower()


def check_typosquatting(domain: str):
    clean_domain = re.sub(r'^www\.', '', domain)
    parts = clean_domain.split('.')
    sld = parts[-2] if len(parts) >= 2 else parts[0]
    segments = [s for s in re.split(r'[.\-_]', clean_domain) if len(s) > 2]

    for brand_domain, brand_name in BRAND_DOMAINS.items():
        if clean_domain == brand_domain or clean_domain.endswith('.' + brand_domain):
            continue

        brand_key = brand_domain.split('.')[0]

        for segment in segments:
            seg_norm = normalize_for_levenshtein(segment)
            brand_norm = normalize_for_levenshtein(brand_key)
            if seg_norm != brand_norm and levenshtein(seg_norm, brand_norm) <= 2:
                return brand_name

        if levenshtein(sld, brand_key) <= 2:
            return brand_name

    return None


def has_mixed_script(domain: str) -> bool:
    scripts = set()
    for char in domain:
        cp = ord(char)
        if 0x0400 <= cp <= 0x04FF:
            scripts.add('cyrillic')
        elif 0x0370 <= cp <= 0x03FF:
            scripts.add('greek')
        elif 0x0600 <= cp <= 0x06FF:
            scripts.add('arabic')
        elif 0x4E00 <= cp <= 0x9FFF:
            scripts.add('cjk')
        elif 0xAC00 <= cp <= 0xD7AF:
            scripts.add('korean')
        elif 0x3040 <= cp <= 0x309F:
            scripts.add('japanese')
        elif cp > 0x7A:
            scripts.add('other')
    if scripts and ('cyrillic' in scripts or 'greek' in scripts or 'arabic' in scripts):
        return True
    return False


def extract_urls(text: str) -> list[str]:
    seen = set()
    results = []
    for match in URL_RE.finditer(text):
        url = match.group(0).strip()
        url = re.sub(r'[.,;:!?)\]]+$', '', url)
        url = url.rstrip('/')
        if url and url not in seen:
            seen.add(url)
            results.append(url)
    return results


def normalize_url(url: str) -> str:
    url = url.strip()
    if not re.match(r'^https?://', url, re.I):
        url = 'https://' + url
    return url


def analyze_url(input_url: str) -> dict:
    url = normalize_url(input_url)
    checks = []
    score = 0

    try:
        parsed = urlparse(url)
        hostname = parsed.hostname.lower() if parsed.hostname else ''
        pathname = parsed.path.lower() if parsed.path else ''
        port = str(parsed.port) if parsed.port else ''
        has_at = '@' in url and url.index('@') > url.index('://') + 3
    except Exception:
        # Fallback parsing
        at_idx = url.find('@')
        if at_idx > 8:
            after_at = url[at_idx + 1:]
            slash_idx = after_at.find('/')
            hostname = after_at[:slash_idx].lower() if slash_idx >= 0 else after_at.lower()
            pathname = after_at[slash_idx:].lower() if slash_idx >= 0 else '/'
            has_at = True
            port = ''
        else:
            hostname = url.replace('https://', '').replace('http://', '').split('/')[0].lower()
            pathname = '/'
            has_at = False
            port = ''

    if not hostname:
        return {
            'url': input_url,
            'domain': '',
            'risk_score': 0,
            'risk_level': 'Safe',
            'is_shortened': False,
            'checks': [{'name': 'Parse Error', 'passed': False, 'detail': 'Could not parse this URL.'}],
        }

    domain_parts = hostname.split('.')
    tld = domain_parts[-1] if len(domain_parts) > 1 else ''

    # Check 1: URL Shortener
    clean_host = hostname.replace('www.', '')
    is_shortened = clean_host in SHORTENERS
    checks.append({
        'name': 'URL Shortener',
        'passed': not is_shortened,
        'detail': f'This URL uses a link shortener ({hostname}), which hides the actual destination.' if is_shortened else 'No URL shortener detected.',
    })
    if is_shortened:
        score += 10

    # Check 2: Suspicious TLD
    is_suspicious_tld = tld in SUSPICIOUS_TLDS
    checks.append({
        'name': 'Suspicious TLD',
        'passed': not is_suspicious_tld,
        'detail': f'The domain uses a suspicious top-level domain (.{tld}), commonly used in scams.' if is_suspicious_tld else f'Top-level domain (.{tld}) appears legitimate.',
    })
    if is_suspicious_tld:
        score += 15

    # Check 3: Typosquatting
    typosquatted_brand = check_typosquatting(hostname)
    checks.append({
        'name': 'Typosquatting',
        'passed': not typosquatted_brand,
        'detail': f'This domain mimics "{typosquatted_brand}" — it looks similar but is a different domain.' if typosquatted_brand else 'No typosquatting detected against known brands.',
    })
    if typosquatted_brand:
        score += 25

    # Check 4: IP-based URL
    ip_regex = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
    is_ip = bool(ip_regex.match(hostname))
    checks.append({
        'name': 'IP-based URL',
        'passed': not is_ip,
        'detail': f'This URL uses a raw IP address ({hostname}) instead of a domain name — common in phishing.' if is_ip else 'Uses a domain name, not a raw IP address.',
    })
    if is_ip:
        score += 20

    # Check 5: Excessive Subdomains
    excessive_subs = len(domain_parts) > 3 and not is_ip
    checks.append({
        'name': 'Excessive Subdomains',
        'passed': not excessive_subs,
        'detail': f'This URL has {len(domain_parts) - 2} subdomains — unusually high and often hides the real domain.' if excessive_subs else 'Standard number of subdomains.',
    })
    if excessive_subs:
        score += 10

    # Check 6: Suspicious Path Keywords
    path_segments = [s for s in pathname.split('/') if s]
    suspicious_segments = [s for s in path_segments if s in PHISHING_KEYWORDS or s.replace('-', '') in PHISHING_KEYWORDS]
    has_suspicious_path = len(suspicious_segments) > 0
    checks.append({
        'name': 'Suspicious Path Keywords',
        'passed': not has_suspicious_path,
        'detail': f'The URL path contains suspicious keywords ({", ".join(suspicious_segments)}), often used in phishing.' if has_suspicious_path else 'No suspicious path keywords detected.',
    })
    if has_suspicious_path:
        score += 10

    # Check 7: @ Symbol
    checks.append({
        'name': '@ Symbol in URL',
        'passed': not has_at,
        'detail': 'This URL contains an @ symbol — everything before it is ignored by browsers.' if has_at else 'No @ symbol present in the URL.',
    })
    if has_at:
        score += 25

    # Check 8: Excessive URL Encoding
    encoded = re.findall(r'%[0-9a-fA-F]{2}', url)
    excessive_encoding = len(encoded) >= 3
    checks.append({
        'name': 'Excessive URL Encoding',
        'passed': not excessive_encoding,
        'detail': f'The URL contains {len(encoded)} percent-encoded characters, often used to obfuscate phishing URLs.' if excessive_encoding else 'No excessive URL encoding detected.',
    })
    if excessive_encoding:
        score += 10

    # Check 9: Known Phishing Domain
    is_known = clean_host in KNOWN_PHISHING_DOMAINS or hostname in KNOWN_PHISHING_DOMAINS
    checks.append({
        'name': 'Known Phishing Domain',
        'passed': not is_known,
        'detail': f'This domain ({hostname}) is on our known phishing blocklist.' if is_known else 'Domain is not on the known phishing blocklist.',
    })
    if is_known:
        score += 40

    # Check 10: Non-standard Port
    standard_ports = {'80', '443', '8080', '3000', '5000', '8000', '8443'}
    non_standard_port = port != '' and port not in standard_ports
    checks.append({
        'name': 'Non-standard Port',
        'passed': not non_standard_port,
        'detail': f'This URL uses an unusual port ({port}), which can indicate a non-legitimate service.' if non_standard_port else 'Standard port or no port specified.',
    })
    if non_standard_port:
        score += 10

    # Check 11: Long Domain
    is_long = len(hostname) > 30
    checks.append({
        'name': 'Excessively Long Domain',
        'passed': not is_long,
        'detail': f'The domain is {len(hostname)} characters long — unusually long domains can hide the real website name.' if is_long else 'Domain length is normal.',
    })
    if is_long:
        score += 10

    # Check 12: Mixed Script / Homograph
    mixed = not is_ip and has_mixed_script(hostname)
    checks.append({
        'name': 'Mixed Script / Homograph Attack',
        'passed': not mixed,
        'detail': 'This domain uses characters from multiple writing systems, suggesting a homograph attack.' if mixed else 'No mixed-script characters detected.',
    })
    if mixed:
        score += 25

    # Check 13: Excessive Hyphens
    hyphen_count = hostname.count('-')
    excessive_hyphens = hyphen_count >= 4
    checks.append({
        'name': 'Excessive Hyphens',
        'passed': not excessive_hyphens,
        'detail': f'The domain contains {hyphen_count} hyphens — excessive hyphens are a common phishing pattern.' if excessive_hyphens else 'No excessive hyphens in domain.',
    })
    if excessive_hyphens:
        score += 10

    score = min(score, 100)

    if score >= 50:
        risk_level = 'Likely Malicious'
    elif score >= 20:
        risk_level = 'Suspicious'
    else:
        risk_level = 'Safe'

    return {
        'url': input_url,
        'domain': hostname,
        'risk_score': score,
        'risk_level': risk_level,
        'is_shortened': is_shortened,
        'checks': checks,
    }


def analyze_urls(text: str) -> list[dict]:
    urls = extract_urls(text)
    seen = set()
    results = []
    for url in urls:
        normalized = normalize_url(url)
        if normalized in seen:
            continue
        seen.add(normalized)
        results.append(analyze_url(url))
    return results
