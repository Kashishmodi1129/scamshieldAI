import { Link } from 'react-router-dom';
import type { Report } from '../../types';

interface Props {
  reports: Report[];
}

const levelStyles: Record<string, string> = {
  Safe: 'text-green-400 bg-green-500/10 border-green-500/30',
  'Likely Safe': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Suspicious: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'High Risk': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export function RecentAnalyses({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="glass-card rounded-[32px] p-10 text-center">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No analyses yet. Run your first check!</p>
        <Link to="/analyze" className="inline-block mt-4 btn-gradient px-6 py-2 rounded-full text-sm font-bold">
          Analyze a conversation
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.slice(0, 5).map((r) => (
        <Link
          key={r.id}
          to={`/reports/${r.id}`}
          className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-all"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {r.conversation.slice(0, 80)}{r.conversation.length > 80 ? '...' : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <span className="text-xl font-bold">{r.risk_score}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${levelStyles[r.risk_level] ?? ''}`}>
              {r.risk_level}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
