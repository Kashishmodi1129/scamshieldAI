import { Link } from 'react-router-dom';
import type { Report } from '../../types';

interface Props {
  report: Report;
  onDelete: (id: number) => void;
}

const levelStyles: Record<string, string> = {
  Safe: 'text-green-400 bg-green-500/10 border-green-500/30',
  'Likely Safe': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Suspicious: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'High Risk': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export function ReportCard({ report, onDelete }: Props) {
  return (
    <div className="glass-card rounded-[32px] p-8 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${levelStyles[report.risk_level] ?? ''}`}>
            {report.risk_level}
          </span>
          <span className="text-2xl font-extrabold">{report.risk_score}</span>
          <span className="text-[10px] tracking-widest font-bold text-gray-500 uppercase">Risk Score</span>
        </div>
        <button
          onClick={() => onDelete(report.id)}
          className="text-gray-600 hover:text-red-400 transition-colors"
          title="Delete report"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{report.conversation}</p>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-500">
          {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <Link to={`/reports/${report.id}`} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          View Details →
        </Link>
      </div>
    </div>
  );
}
