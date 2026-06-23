import type { FlaggedMessage } from '../types';

interface Rule {
  pattern: RegExp;
  reason: string;
  severity: FlaggedMessage['severity'];
  score: number;
}

const CRITICAL: Rule[] = [
  {
    pattern: /(?:send|give|share|provide|forward|tell|what's?|need|want|submit|enter|put|type|confirm)\s*(?:me|us|the|your)?\s*(?:the|your|my|this|that)?\s*(?:otp|one.?time.?pin|verification\s*code|auth(?:entication)?\s*code|banking\s*password|upi\s*pin|internet\s*banking\s*password|debit\s*card\s*pin|atm\s*pin|password|login\s*details|credentials|account\s*details)/i,
    reason: 'Direct credential harvesting attempt — OTP/password request',
    severity: 'critical',
    score: 75,
  },
  {
    pattern: /(?:pay|send|transfer|remit|deposit|paytm|gpay|phonepay)\s*(?:me|us|the|now)?\s*(?:₹|rs|rupees|money|cash|amount)\s*(?:\d+[\d,.]*)?/i,
    reason: 'Direct payment/money transfer request',
    severity: 'critical',
    score: 65,
  },
  {
    pattern: /(?:won|winner|prize|lucky|selected|reward|congratulations)\s*(?:[^.]{0,40})?\s*(?:pay|send|fee|charges?|₹|rs|deposit|processing\s*fee|claim|advance|token|registration\s*fee)/i,
    reason: 'Prize scam requiring payment to claim',
    severity: 'critical',
    score: 75,
  },
  {
    pattern: /(?:scan|pay)\s*(?:this|the|my|below|following|above|this\s*qr)?\s*(?:qr|qr\s*code)/i,
    reason: 'QR code payment scan request — common UPI fraud',
    severity: 'critical',
    score: 65,
  },
  {
    pattern: /(?:send|transfer|receive|get)\s*(?:me|us)?\s*(?:money|₹|rs|cash|funds?)(?:.*?)(?:account|upi|wallet)/i,
    reason: 'Financial transfer request to account/UPI',
    severity: 'critical',
    score: 60,
  },
];

const HIGH: Rule[] = [
  {
    pattern: /(?:your|the|my)\s*(?:\w+\s+)?(?:account|card|banking|wallet|upi|service|access|profile)(?:\s+has\s+been|\s+is\s+|\s+will\s+be\s+|\s+)?\s*(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)/i,
    reason: 'Account frozen/blocked threat — impersonation tactic',
    severity: 'high',
    score: 55,
  },
  {
    pattern: /(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)(?:.{0,30})(?:account|card|banking|wallet|upi)/i,
    reason: 'Account action threat language',
    severity: 'high',
    score: 55,
  },
  {
    pattern: /(?:account|card|banking|wallet|upi|service|access|profile)(?:\s+(?:has\s+been|is|will\s+be)\s+)?(?:blocked|suspended|deactivated|terminated|restricted|disabled|frozen|locked)/i,
    reason: 'Account/card blocked or restricted threat',
    severity: 'high',
    score: 50,
  },
  {
    pattern: /(?:kyc|know.?your.?customer|aadhaar|aadhar|pan.?card|e-?kyc)(?:.{0,20})(?:update|expire|verify|link|complete|fail|pending|required|number)/i,
    reason: 'Fake KYC/Aadhaar verification request',
    severity: 'high',
    score: 50,
  },
  {
    pattern: /(?:income.?tax|itr|tax\s*refund|refund\s*amount)(?:.{0,30})(?:credit|deposit|claim|link|click|pending)/i,
    reason: 'Fake tax refund phishing',
    severity: 'high',
    score: 45,
  },
  {
    pattern: /(?:otp|one.?time.?pin|verification\s*code)\s*(?:.{0,20})?(?:sent|share|tell|send|give|forward|provide)/i,
    reason: 'OTP being requested/sent to victim',
    severity: 'high',
    score: 40,
  },
  {
    pattern: /(?:upi|vpa|@paytm|@okhdfc|@okicici|@ybl|@axl|@ibl)/i,
    reason: 'UPI ID/VPA detected — potential payment collection',
    severity: 'high',
    score: 40,
  },
  {
    pattern: /(?:sbi|hdfc|icici|axis\s*bank|bank\s*manager|rbi\b|income\.?tax\s*(?:dept|office|department)|court|police\s*|cbi\b|narcotics|cyber\s*crime\s*(?:cell|branch|dept)|drugs\s*|parcel\s*(?:from|contains|with)|fedex|dhl|customs\s*(?:dept|authority))/i,
    reason: 'Authority impersonation — common scam tactic',
    severity: 'high' as const,
    score: 45,
  },
  {
    pattern: /(?:parcel|package|courier).{0,30}(?:drugs|narcotics|cocaine|illegal|contraband)/i,
    reason: 'Drug parcel scam — common FedEx/Courier impersonation',
    severity: 'high' as const,
    score: 55,
  },
  {
    pattern: /(?:click|tap|visit|sign\s*in|login|verify|update)\s*(?:.{0,20})?\s*(?:to|and|here|now|below)\s*(?:verify|update|confirm|login|sign|unlock|reactivate)/i,
    reason: 'Suspicious action chain — potential phishing',
    severity: 'medium' as const,
    score: 35,
  },
  {
    pattern: /(?:click|tap|visit|verify|update|confirm)\s*(?:.{0,30})?\s*(?:http|https|www\.)\S+/i,
    reason: 'Action request with embedded URL — phishing indicator',
    severity: 'high' as const,
    score: 40,
  },
  {
    pattern: /(?:share|send|provide|give|need|want|submit)\s*(?:me|us|your)?\s*(?:the|your)?\s*(?:details|info|information|data|bank\s*details|aadhaar|aadhar|pan|pan\s*number|aadhaar\s*number|account\s*number)/i,
    reason: 'Request for personal/banking information',
    severity: 'high' as const,
    score: 40,
  },
  {
    pattern: /(?:pan|aadhaar|voter|passport|ssn|itin|driving\s*license)\s*(?:and|&|,)\s*(?:pan|aadhaar|voter|passport|ssn|itin|driving\s*license)/i,
    reason: 'Request for multiple identity documents — strong fraud indicator',
    severity: 'high' as const,
    score: 50,
  },
  {
    pattern: /(?:click|tap|install|download|update|open|tap\s*on)\s*(?:this|the|link|url|app|attachment|file|apk|button)/i,
    reason: 'Suspicious action request — malware/phishing link',
    severity: 'high',
    score: 40,
  },
  {
    pattern: /(?:http|https):\/\/(?:\d{1,3}\.){3}\d{1,3}(?:\:\d+)?(?:\/\S*)?/i,
    reason: 'IP-based URL detected — raw IP in link is a phishing red flag',
    severity: 'high',
    score: 45,
  },
  {
    pattern: /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)*(?:bit\.ly|tinyurl\.com|t\.co|rb\.gy|cutt\.ly|shorturl\.at|ow\.ly|is\.gd|buff\.ly|adf\.ly)\/\S+/i,
    reason: 'Shortened URL detected — destination is hidden',
    severity: 'medium',
    score: 25,
  },
  {
    pattern: /(?:https?:\/\/)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.(?:tk|ml|cf|ga|gq|xyz|top|loan|click|download|gdn|bid|date|win|men|review|trade|party|racing|accountant|work|stream)\b/i,
    reason: 'Suspicious TLD in URL — common among scam websites',
    severity: 'high',
    score: 35,
  },
  {
    pattern: /(?:urgent|immediately|right\s*now|asap|act\s*now|limited\s*time|expires?\s*today|last\s*chance|hurry|quick|don't\s*lose|today\s*only|time\s*running)/i,
    reason: 'High-pressure urgency tactic',
    severity: 'high',
    score: 35,
  },
  {
    pattern: /(?:army|officer|colonel|general|sir|captain|dr|doctor|major|navy)\s*(?:transferred|posted|relocated|abroad|out\s*of\s*station|serving|deployed)/i,
    reason: 'Fake Army/Doctor property scam',
    severity: 'high',
    score: 45,
  },
  {
    pattern: /(?:refund|claim)\s*(?:your|the|of|my)\s*(?:money|amount|₹|rs)\s*(?:\d+|back)/i,
    reason: 'Fake refund request — common PhonePe/GPay scam',
    severity: 'high',
    score: 40,
  },
  {
    pattern: /(?:click|visit)\s*(?:the|this|below|following)?\s*(?:link|url)(?:.{0,30})(?:verify|update|confirm|login|sign)/i,
    reason: 'Phishing link with action request',
    severity: 'high',
    score: 45,
  },
];

const MEDIUM: Rule[] = [
  { pattern: /\b\d{10}\b/, reason: 'Phone number shared', severity: 'medium', score: 15 },
  { pattern: /(?:http|https|www\.)\S+/i, reason: 'URL/link detected', severity: 'medium', score: 20 },
  { pattern: /(?:refund|cashback|bonus|free|offer|discount|gift|voucher|scheme|deal)/i, reason: 'Too-good-to-be-true offer language', severity: 'medium', score: 20 },
  { pattern: /(?:won|winner|prize|lucky|lottery|selected|congratulations|congrats|exclusive|limited\s*offer|lucky\s*winner)/i, reason: 'Prize/lottery/giveaway language', severity: 'medium', score: 25 },
  { pattern: /(?:account|bank|card|wallet|profile)\s*(?:verify|verification|update|upgrade|confirm)/i, reason: 'Account verification request', severity: 'medium', score: 25 },
  { pattern: /(?:sign|login|log\s*in|verify|authenticate)\s*(?:now|here|below)/i, reason: 'Login/authentication prompt', severity: 'medium', score: 20 },
];

const LOW: Rule[] = [
  { pattern: /(?:rate|review|feedback|survey).{0,20}(?:earn|₹|rs|money|gift|reward)/i, reason: 'Suspicious paid review/survey', severity: 'low', score: 10 },
  { pattern: /(?:unknown|wrong|missed|random|strange)\s*(?:number|call|message|person|chat)/i, reason: 'Wrong-number contact — potential pig butchering start', severity: 'low', score: 10 },
];

const SAFE_CONTEXT: Rule[] = [
  {
    pattern: /(?:do\s+not|don't|never|avoid|donot|shouldn't|should\s+not|please\s+don't)\s*(?:share|give|send|tell|reveal|disclose|provide|forward).{0,30}(?:otp|password|pin|details|code|info)/i,
    reason: 'Safety advice — warning against sharing credentials',
    severity: 'safe_context',
    score: -35,
  },
  {
    pattern: /(?:be\s*careful|beware|cautious|watch\s*out|stay\s*safe|be\s*aware|remember)\s*(?:of|with|about)?\s*(?:scam|fraud|phishing|fake|cheat)/i,
    reason: 'Scam awareness message',
    severity: 'safe_context',
    score: -30,
  },
  {
    pattern: /(?:never|don't|do\s+not)\s*pay\s*(?:any|a|the)?\s*(?:money|fee|amount|charges|₹|rs)/i,
    reason: 'Warning against paying — anti-scam advice',
    severity: 'safe_context',
    score: -30,
  },
  {
    pattern: /(?:my|the|this)\s*(?:otp|password|verification\s*code|pin|code)\s*(?:is\s*not\s*(?:arriving|coming|working|received|sending|delivered|being\s*sent|going\s*through)|not\s*(?:received|getting|working)|(?:hasn't|has\s*not|isn't|is\s*not)\s*(?:arrived|come|been\s*received|working|sent))/i,
    reason: 'User reporting issue receiving OTP — not a scam request',
    severity: 'safe_context',
    score: -30,
  },
  {
    pattern: /(?:i|we)\s*(?:have\s*)?(?:just\s*)?(?:received|got|gotten)\s*(?:an?\s*)?(?:otp|password|code|verification\s*code)/i,
    reason: 'User stating they received an OTP — passive statement',
    severity: 'safe_context',
    score: -15,
  },
  {
    pattern: /thank\s*(?:you|s|u|you\s*for|you\s*so\s*much).{0,40}(?:otp|code|password|help|info)/i,
    reason: 'Thanking for legitimate service delivery',
    severity: 'safe_context',
    score: -20,
  },
  {
    pattern: /(?:yes|ok|sure|okay|fine|got\s*it|received)\s*(?:.{0,30})?\s*(?:thanks|thank\s*you|sent|received|done)/i,
    reason: 'Acknowledgment — not a scam request',
    severity: 'safe_context',
    score: -10,
  },
];

export function analyzeWithRules(text: string): { score: number; flagged_messages: FlaggedMessage[] } {
  const flagged: FlaggedMessage[] = [];
  let score = 0;
  let hasCritical = false;
  let hasOtpRequest = false;

  for (const rule of CRITICAL) {
    const match = text.match(rule.pattern);
    if (match) {
      flagged.push({ text: match[0], reason: rule.reason, severity: rule.severity });
      score += rule.score;
      hasCritical = true;
      if (/otp|password|credential/i.test(rule.reason)) hasOtpRequest = true;
    }
  }

  for (const rule of HIGH) {
    const match = text.match(rule.pattern);
    if (match) {
      flagged.push({ text: match[0], reason: rule.reason, severity: rule.severity });
      score += rule.score;
    }
  }

  for (const rule of MEDIUM) {
    const match = text.match(rule.pattern);
    if (match) {
      flagged.push({ text: match[0], reason: rule.reason, severity: rule.severity });
      score += rule.score;
    }
  }

  for (const rule of LOW) {
    const match = text.match(rule.pattern);
    if (match) {
      flagged.push({ text: match[0], reason: rule.reason, severity: rule.severity });
      score += rule.score;
    }
  }

  for (const rule of SAFE_CONTEXT) {
    const match = text.match(rule.pattern);
    if (match) {
      flagged.push({ text: match[0], reason: rule.reason, severity: rule.severity });
      score += rule.score;
    }
  }

  if (hasOtpRequest) score = Math.max(score, 80);
  else if (hasCritical) score = Math.max(score, 60);

  score = Math.max(0, Math.min(score, 100));

  return { score, flagged_messages: flagged };
}

export function getRiskLevel(score: number, threshold: number): 'Safe' | 'Likely Safe' | 'Suspicious' | 'High Risk' {
  if (score >= threshold) return 'High Risk';
  if (score >= threshold * 0.65) return 'Suspicious';
  if (score >= threshold * 0.3) return 'Likely Safe';
  return 'Safe';
}
