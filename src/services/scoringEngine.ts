import type { AnalysisResult, DeveloperSettings, FlaggedMessage, LinkAnalysis } from '../types';
import { getRiskLevel } from './ruleEngine';

export function computeFinalScore(
  ruleScore: number,
  llmResult: Partial<AnalysisResult> | null,
  settings: DeveloperSettings,
  existingFlags?: FlaggedMessage[],
  linkAnalysis?: LinkAnalysis[],
): AnalysisResult {
  let finalScore: number;
  let risk_level: AnalysisResult['risk_level'];
  let category = '';
  let tactics: string[] = [];
  let flagged_messages: AnalysisResult['flagged_messages'] = [];
  let explanation = '';
  let recommendations: string[] = [];
  let is_fallback = false;
  let confidence = 0.0;

  switch (settings.detection_mode) {
    case 'fast':
      finalScore = ruleScore;
      flagged_messages = existingFlags ?? [];
      explanation = 'Fast mode analysis based on rule engine only.';
      recommendations = ['Enable Balanced or Deep mode for LLM-powered analysis.'];
      is_fallback = true;
      confidence = 0.6;
      break;

    case 'balanced':
    case 'deep':
      if (llmResult) {
        const llmScore = llmResult.risk_score ?? ruleScore;
        const llmConfidence = llmResult.confidence ?? 0.8;
        const llmWeight = settings.detection_mode === 'balanced' ? 0.6 : 0.8;
        const ruleWeight = 1.0 - llmWeight;

        finalScore = Math.round(ruleScore * ruleWeight + llmScore * llmWeight);
        category = llmResult.category ?? '';
        tactics = llmResult.tactics ?? [];
        flagged_messages = [...new Map(
          [...(existingFlags ?? []), ...(llmResult.flagged_messages ?? [])].map(m => [m.text + m.reason, m])
        ).values()];
        explanation = llmResult.explanation ?? '';
        recommendations = llmResult.recommendations ?? [];
        confidence = llmConfidence;

        if (llmScore >= settings.confidence_threshold && llmConfidence >= 0.7) {
          finalScore = Math.max(finalScore, llmScore);
        } else if (llmScore >= 60 && llmConfidence >= 0.8) {
          finalScore = Math.max(finalScore, llmScore);
        }
      } else {
        finalScore = ruleScore;
        flagged_messages = existingFlags ?? [];
        explanation = 'Limited Analysis Mode — LLM unavailable. Results are from rule engine only.';
        recommendations = ['Configure an API key in Developer Settings for full AI analysis.'];
        is_fallback = true;
        confidence = 0.5;
      }
      break;

    default:
      finalScore = ruleScore;
      flagged_messages = existingFlags ?? [];
      explanation = 'Limited Analysis Mode — unknown detection mode.';
      recommendations = [];
      is_fallback = true;
      confidence = 0.5;
  }

  if (linkAnalysis && linkAnalysis.length > 0) {
    const maxLinkScore = Math.max(...linkAnalysis.map(l => l.risk_score));
    const hasSuspicious = linkAnalysis.some(l => l.risk_level !== 'Safe');
    if (hasSuspicious && maxLinkScore > 0) {
      finalScore = Math.round(finalScore * 0.7 + maxLinkScore * 0.3);
      finalScore = Math.max(finalScore, ruleScore);
    }
    if (!tactics.includes('Suspicious Link Detected') && hasSuspicious) {
      tactics.push('Suspicious Link Detected');
    }
  }

  const threshold = settings.confidence_threshold;
  risk_level = getRiskLevel(finalScore, threshold);

  return {
    risk_score: finalScore,
    risk_level,
    category,
    tactics,
    flagged_messages,
    explanation,
    recommendations,
    is_fallback,
    confidence,
    link_analysis: linkAnalysis && linkAnalysis.length > 0 ? linkAnalysis : undefined,
  };
}
