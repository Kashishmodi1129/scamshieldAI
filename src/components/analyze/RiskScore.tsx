import type { AnalysisResult } from '../../types';

interface Props {
  result: AnalysisResult;
}

const levelStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  'Safe': { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '🛡️' },
  'Likely Safe': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: '✓' },
  'Suspicious': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '⚠️' },
  'High Risk': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '🚨' },
};

export function RiskScore({ result }: Props) {
  const style = levelStyles[result.risk_level] ?? levelStyles['Safe'];
  const scoreColor = result.risk_score >= 70 ? '#ef4444' : result.risk_score >= 45 ? '#eab308' : result.risk_score >= 20 ? '#34d399' : '#22c55e';

  return (
    <div className="text-center">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${style.bg} ${style.border} border ${style.text} text-sm font-bold mb-4`}>
        <span>{style.icon}</span>
        {result.risk_level}
      </div>
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={scoreColor}
            strokeWidth="3"
            strokeDasharray={`${result.risk_score}, 100`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-extrabold">{result.risk_score}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400">Risk Score</p>
      {result.confidence !== undefined && result.confidence > 0 && (
        <p className="text-[10px] text-gray-600 mt-1">confidence: {Math.round(result.confidence * 100)}%</p>
      )}
    </div>
  );
}
