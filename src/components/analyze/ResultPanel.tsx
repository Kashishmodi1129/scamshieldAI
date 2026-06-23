import type { AnalysisResult } from '../../types';
import { RiskScore } from './RiskScore';
import { LinkResult } from './LinkResult';

interface Props {
  result: AnalysisResult;
}

export function ResultPanel({ result }: Props) {
  const safeFlags = result.flagged_messages.filter(m => m.severity === 'safe_context');
  const alertFlags = result.flagged_messages.filter(m => m.severity !== 'safe_context');

  return (
    <div className="glass-card rounded-[40px] p-10">
      {result.is_fallback && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-sm font-bold text-yellow-400">Limited Analysis Mode</span>
          </div>
          <p className="text-xs text-yellow-400/70">{result.explanation}</p>
        </div>
      )}

      <RiskScore result={result} />

      {result.category && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Category</p>
          <p className="text-white font-semibold">{result.category}</p>
        </div>
      )}

      {result.tactics.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Scam Tactics Detected</p>
          <div className="flex flex-wrap gap-2">
            {result.tactics.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] font-bold text-red-400">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {alertFlags.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Flagged Content</p>
          <div className="space-y-2">
            {alertFlags.map((m, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                m.severity === 'critical'
                  ? 'bg-red-900/20 border-red-500/30'
                  : m.severity === 'high'
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-slate-900/50 border-white/5'
              }`}>
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  m.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                  m.severity === 'high' ? 'bg-red-500' :
                  m.severity === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div>
                  <p className="text-sm text-gray-300 font-mono">&ldquo;{m.text}&rdquo;</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.link_analysis && result.link_analysis.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">
            Detected Links
            <span className="ml-2 text-gray-600 font-normal">
              ({result.link_analysis.filter(l => l.risk_level !== 'Safe').length} flagged)
            </span>
          </p>
          <div className="space-y-2">
            {result.link_analysis.map((link, i) => (
              <LinkResult key={i} link={link} />
            ))}
          </div>
        </div>
      )}

      {result.explanation && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">AI Explanation</p>
          <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Recommendations</p>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-cyan-500 mt-0.5">→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {safeFlags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-[10px] tracking-widest font-bold text-gray-600 uppercase mb-3">Context Flags (Safe Signals)</p>
          <div className="space-y-2">
            {safeFlags.map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-900/10 border border-green-500/20">
                <span className="mt-0.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-300 font-mono">&ldquo;{m.text}&rdquo;</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
