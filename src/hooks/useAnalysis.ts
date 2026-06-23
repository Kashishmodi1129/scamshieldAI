import { useState, useCallback } from 'react';
import type { AnalysisResult, AnalysisStatus, DeveloperSettings, LinkAnalysis } from '../types';
import { api } from '../services/api';
import { analyzeWithRules } from '../services/ruleEngine';
import { analyzeUrls } from '../services/linkAnalysis';
import { computeFinalScore } from '../services/scoringEngine';

export function useAnalysis(settings: DeveloperSettings) {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const analyze = useCallback(async (conversation: string) => {
    setStatus('analyzing');
    setError(null);
    setIsLimitedMode(false);

    const { score: ruleScore, flagged_messages: ruleFlags } = analyzeWithRules(conversation);
    const linkAnalysis: LinkAnalysis[] = analyzeUrls(conversation);

    try {
      if (settings.detection_mode === 'fast') {
        await new Promise((r) => setTimeout(r, 800));
        const final = computeFinalScore(ruleScore, null, settings, ruleFlags, linkAnalysis);
        setResult(final);
        setStatus('complete');
        setIsLimitedMode(true);
        return;
      }

      const llmRes = await api.analyze(conversation);
      const final = computeFinalScore(ruleScore, llmRes.result, settings, ruleFlags, linkAnalysis);
      setResult(final);
      setStatus('complete');

      if (llmRes.result.is_fallback) {
        setIsLimitedMode(true);
        setError('Limited Analysis Mode — LLM unavailable. Results are from rule engine only.');
      }
    } catch (err) {
      const fallback = computeFinalScore(ruleScore, null, settings, ruleFlags, linkAnalysis);
      setResult(fallback);
      setStatus('complete');
      setIsLimitedMode(true);
      setError('Limited Analysis Mode — server unreachable. Results are from local rule engine only.');
    }
  }, [settings]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setIsLimitedMode(false);
  }, []);

  return { status, result, error, isLimitedMode, analyze, reset };
}
