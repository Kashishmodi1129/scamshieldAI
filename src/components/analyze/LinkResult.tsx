import { useState } from 'react';
import type { LinkAnalysis } from '../../types';

interface Props {
  link: LinkAnalysis;
}

const COLORS = {
  'Safe': { bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500', text: 'text-green-400' },
  'Suspicious': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400' },
  'Likely Malicious': { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500 animate-pulse', text: 'text-red-400' },
};

export function LinkResult({ link }: Props) {
  const [expanded, setExpanded] = useState(false);
  const c = COLORS[link.risk_level];
  const failedChecks = link.checks.filter((ch) => !ch.passed);
  const total = link.checks.length;
  const passed = link.checks.filter((ch) => ch.passed).length;

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:opacity-80 transition-opacity text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-mono text-gray-200 truncate">{link.url}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{link.domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className={`text-[11px] font-bold ${c.text}`}>{link.risk_level}</span>
          {failedChecks.length > 0 && (
            <span className="text-[11px] text-gray-500">({failedChecks.length} issue{failedChecks.length !== 1 ? 's' : ''})</span>
          )}
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-white/5">
          <div className="pt-3 space-y-1.5">
            {failedChecks.length === 0 ? (
              <p className="text-[12px] text-green-500 py-1">✓ No issues detected for this link.</p>
            ) : (
              failedChecks.map((check, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-red-400">✗ {check.name}</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{check.detail}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
