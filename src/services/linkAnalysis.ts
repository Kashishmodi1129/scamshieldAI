import type { LinkAnalysis, LinkCheck } from '../types';

const URL_REGEX = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'shorturl.at', 'rb.gy', 'cutt.ly', 'shorte.st', 'adf.ly', 'bc.vc',
  'tiny.cc', 'bl.ink', 's.id', 'rebrandly', 'cllk.am', 'v.gd', 'u.bb',
  'short.link', 'zip.net', 'shrinke.me', 'tiny.ie', 'hit.my', '1url.com',
  'short.cm', 'short.gy', 'surl.li', 'dub.sh', 'urlz.ee', 'gg.gg',
  'shorturl.ac', 'soo.gd', 'lnkd.in', 'po.st', 'rlu.ru', 'stfly.me',
  'qr.ae', 'shorl.com', 't2m.io', 'x.co', 'mgnet.me',
]);

const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'cf', 'ga', 'gq', 'xyz', 'top', 'loan', 'click', 'download',
  'gdn', 'bid', 'date', 'win', 'men', 'review', 'trade', 'webcam',
  'science', 'party', 'racing', 'accountant', 'work', 'stream', 'gb',
  'jet', 'sbs', 'lol', 'mom', 'uno', 'rip', 'dog', 'space', 'pics',
  'country', 'kim', 'cool', 'today', 'info', 'pro', 'site', 'icu',
  'cyou', 'monster', 'rest', 'faith', 'download', 'peanut', 'lol',
  'porn', 'sex', 'adult', 'dating', 'cricket',
]);

const PHISHING_KEYWORDS = new Set([
  'login', 'signin', 'sign-in', 'verify', 'secure', 'update', 'reset',
  'recover', 'authenticate', 'confirm', 'activate', 'validate', 'kyc',
  'aadhaar', 'aadhar', 'pan', 'e-kyc', 'ekyc', 'otp', 'password',
  'payment', 'wallet', 'banking', 'account', 'authorize', 'sso',
  '2fa', 'two-factor', 'credential', 'token', 'reissue', 'unlock',
  'alert', 'security', 'protect', 'suspended', 'blocked', 'restricted',
  'reactivate', 'verification', 'upi', 'gpay', 'phonepay', 'paytm',
  'netbanking', 'internet-banking', 'support', 'help', 'refund',
  'claim', 'reward', 'prize', 'lottery', 'cashback', 'bonus',
]);

const KNOWN_PHISHING_DOMAINS = new Set([
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
]);

const BRAND_DOMAINS: Record<string, string> = {
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
};

const SPECIAL_CHARS_RE = /[.\-_]/g;

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function normalizeForLevenshtein(domain: string): string {
  return domain.replace(SPECIAL_CHARS_RE, '').toLowerCase();
}

function checkTyposquatting(domain: string): string | null {
  const cleanDomain = domain.replace(/^www\./, '');
  const parts = cleanDomain.split('.');
  const sld = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  const segments = cleanDomain.split(/[.\-_]/).filter(s => s.length > 2);

  for (const [brandDomain, brandName] of Object.entries(BRAND_DOMAINS)) {
    if (cleanDomain === brandDomain || cleanDomain.endsWith(`.${brandDomain}`)) continue;

    const brandKey = brandDomain.split('.')[0];

    for (const segment of segments) {
      const segNorm = normalizeForLevenshtein(segment);
      const brandNorm = normalizeForLevenshtein(brandKey);
      if (segNorm !== brandNorm && levenshtein(segNorm, brandNorm) <= 2) {
        return brandName;
      }
    }

    if (levenshtein(sld, brandKey) <= 2) {
      return brandName;
    }
  }
  return null;
}

function hasMixedScript(domain: string): boolean {
  const scripts = new Set<string>();
  for (const char of domain) {
    const code = char.codePointAt(0)!;
    if (code >= 0x0400 && code <= 0x04FF) scripts.add('cyrillic');
    else if (code >= 0x0370 && code <= 0x03FF) scripts.add('greek');
    else if (code >= 0x0600 && code <= 0x06FF) scripts.add('arabic');
    else if (code >= 0x4E00 && code <= 0x9FFF) scripts.add('cjk');
    else if (code >= 0xAC00 && code <= 0xD7AF) scripts.add('korean');
    else if (code >= 0x0E00 && code <= 0x0E7F) scripts.add('thai');
    else if (code >= 0x3040 && code <= 0x309F) scripts.add('japanese');
    else if (code >= 0x1100 && code <= 0x11FF) scripts.add('hangeul');
    else if (code >= 0x1F00 && code <= 0x1FFF) scripts.add('greek-ext');
    else if (code > 0x7A) scripts.add('other');
  }
  scripts.delete('other');
  if (scripts.size > 0 && (scripts.has('cyrillic') || scripts.has('greek') || scripts.has('arabic'))) {
    return true;
  }
  return false;
}

export function extractUrls(text: string): string[] {
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_REGEX.source, URL_REGEX.flags);
  while ((match = re.exec(text)) !== null) {
    let url = match[0].trim();
    const trailing = url.match(/[.,;:!?)\]]+$/);
    if (trailing) {
      url = url.slice(0, -trailing[0].length);
    }
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (url) matches.add(url);
  }
  return Array.from(matches);
}

export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }
  return normalized;
}

export function analyzeUrl(inputUrl: string): LinkAnalysis {
  const url = normalizeUrl(inputUrl);
  let hostname: string;
  let pathname: string;
  let port: string;
  let hasAtSymbol = false;

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.toLowerCase();
    pathname = parsed.pathname.toLowerCase();
    port = parsed.port;
    hasAtSymbol = parsed.href.includes('@') && parsed.href.indexOf('@') < parsed.href.indexOf('/', 10);
  } catch {
    const atIdx = url.indexOf('@');
    if (atIdx > 8) {
      const afterAt = url.slice(atIdx + 1);
      const slashIdx = afterAt.indexOf('/');
      hostname = (slashIdx >= 0 ? afterAt.slice(0, slashIdx) : afterAt).toLowerCase();
      pathname = slashIdx >= 0 ? afterAt.slice(slashIdx).toLowerCase() : '/';
      hasAtSymbol = true;
    } else {
      hostname = url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
      pathname = '/';
    }
    port = '';
  }

  const checks: LinkCheck[] = [];
  let score = 0;

  const tld = hostname.split('.').pop() || '';

  const isShortened = SHORTENERS.has(hostname) || SHORTENERS.has(hostname.replace(/^www\./, ''));
  checks.push({
    name: 'URL Shortener',
    passed: !isShortened,
    detail: isShortened
      ? `This URL uses a link shortener (${hostname}), which hides the actual destination.`
      : 'No URL shortener detected.',
  });
  if (isShortened) score += 10;

  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  checks.push({
    name: 'Suspicious TLD',
    passed: !isSuspiciousTld,
    detail: isSuspiciousTld
      ? `The domain uses a suspicious top-level domain (.${tld}), commonly used in scams.`
      : `Top-level domain (.${tld}) appears legitimate.`,
  });
  if (isSuspiciousTld) score += 15;

  const typosquattedBrand = checkTyposquatting(hostname);
  checks.push({
    name: 'Typosquatting',
    passed: !typosquattedBrand,
    detail: typosquattedBrand
      ? `This domain mimics "${typosquattedBrand}" — it looks similar but is a different domain.`
      : 'No typosquatting detected against known brands.',
  });
  if (typosquattedBrand) score += 25;

  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  const isIpBased = ipRegex.test(hostname);
  checks.push({
    name: 'IP-based URL',
    passed: !isIpBased,
    detail: isIpBased
      ? `This URL uses a raw IP address (${hostname}) instead of a domain name — common in phishing.`
      : 'Uses a domain name, not a raw IP address.',
  });
  if (isIpBased) score += 20;

  const subdomainParts = hostname.split('.');
  const excessiveSubdomains = subdomainParts.length > 3 && !isIpBased;
  checks.push({
    name: 'Excessive Subdomains',
    passed: !excessiveSubdomains,
    detail: excessiveSubdomains
      ? `This URL has ${subdomainParts.length - 2} subdomains, which is unusually high and often used to hide the real domain.`
      : 'Standard number of subdomains.',
  });
  if (excessiveSubdomains) score += 10;

  const pathSegments = pathname.split('/').filter(Boolean);
  const hasSuspiciousPath = pathSegments.some(seg =>
    PHISHING_KEYWORDS.has(seg) || PHISHING_KEYWORDS.has(seg.replace(/-/g, ''))
  );
  checks.push({
    name: 'Suspicious Path Keywords',
    passed: !hasSuspiciousPath,
    detail: hasSuspiciousPath
      ? `The URL path contains suspicious keywords (${pathSegments.filter(s => PHISHING_KEYWORDS.has(s) || PHISHING_KEYWORDS.has(s.replace(/-/g, ''))).join(', ')}), often used in phishing.`
      : 'No suspicious path keywords detected.',
  });
  if (hasSuspiciousPath) score += 10;

  checks.push({
    name: '@ Symbol in URL',
    passed: !hasAtSymbol,
    detail: hasAtSymbol
      ? 'This URL contains an @ symbol — everything before it is ignored by browsers, the real destination is after the @.'
      : 'No @ symbol present in the URL.',
  });
  if (hasAtSymbol) score += 25;

  const encodedMatches = url.match(/%[0-9a-fA-F]{2}/g);
  const excessiveEncoding = (encodedMatches?.length ?? 0) >= 3;
  checks.push({
    name: 'Excessive URL Encoding',
    passed: !excessiveEncoding,
    detail: excessiveEncoding
      ? `The URL contains ${encodedMatches!.length} percent-encoded characters, often used to obfuscate phishing URLs.`
      : 'No excessive URL encoding detected.',
  });
  if (excessiveEncoding) score += 10;

  const isKnownPhishing = KNOWN_PHISHING_DOMAINS.has(hostname) || KNOWN_PHISHING_DOMAINS.has(hostname.replace(/^www\./, ''));
  checks.push({
    name: 'Known Phishing Domain',
    passed: !isKnownPhishing,
    detail: isKnownPhishing
      ? `This domain (${hostname}) is on our known phishing blocklist.`
      : 'Domain is not on the known phishing blocklist.',
  });
  if (isKnownPhishing) score += 40;

  const standardPorts = ['80', '443', '8080', '3000', '5000', '8000', '8443'];
  const hasNonStandardPort = port !== '' && !standardPorts.includes(port);
  checks.push({
    name: 'Non-standard Port',
    passed: !hasNonStandardPort,
    detail: hasNonStandardPort
      ? `This URL uses an unusual port (${port}), which can indicate a non-legitimate service.`
      : 'Standard port or no port specified.',
  });
  if (hasNonStandardPort) score += 10;

  const isLongDomain = hostname.length > 30;
  checks.push({
    name: 'Excessively Long Domain',
    passed: !isLongDomain,
    detail: isLongDomain
      ? `The domain is ${hostname.length} characters long — unusually long domains can hide the real website name.`
      : 'Domain length is normal.',
  });
  if (isLongDomain) score += 10;

  const isMixedScript = !isIpBased && hasMixedScript(hostname);
  checks.push({
    name: 'Mixed Script / Homograph Attack',
    passed: !isMixedScript,
    detail: isMixedScript
      ? `This domain uses characters from multiple writing systems, suggesting a homograph attack where lookalike characters trick users.`
      : 'No mixed-script characters detected.',
  });
  if (isMixedScript) score += 25;

  const hyphenCount = (hostname.match(/-/g) || []).length;
  const hasExcessiveHyphens = hyphenCount >= 4;
  checks.push({
    name: 'Excessive Hyphens',
    passed: !hasExcessiveHyphens,
    detail: hasExcessiveHyphens
      ? `The domain contains ${hyphenCount} hyphens — excessive hyphens are a common phishing pattern (e.g., secure-login-verify.com).`
      : 'No excessive hyphens in domain.',
  });
  if (hasExcessiveHyphens) score += 10;

  score = Math.min(score, 100);

  let riskLevel: LinkAnalysis['risk_level'];
  if (score >= 50) riskLevel = 'Likely Malicious';
  else if (score >= 20) riskLevel = 'Suspicious';
  else riskLevel = 'Safe';

  return {
    url: inputUrl,
    domain: hostname,
    risk_score: score,
    risk_level: riskLevel,
    is_shortened: isShortened,
    checks,
  };
}

export function analyzeUrls(text: string): LinkAnalysis[] {
  const urls = extractUrls(text);
  const seen = new Set<string>();
  const results: LinkAnalysis[] = [];
  for (const url of urls) {
    const normalized = normalizeUrl(url);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    results.push(analyzeUrl(url));
  }
  return results;
}

export function getLinkRiskLevel(score: number): LinkAnalysis['risk_level'] {
  if (score >= 50) return 'Likely Malicious';
  if (score >= 20) return 'Suspicious';
  return 'Safe';
}
