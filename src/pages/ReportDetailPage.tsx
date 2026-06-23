import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Report } from '../types';
import { api } from '../services/api';
import { ResultPanel } from '../components/analyze/ResultPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getReport(Number(id))
        .then(setReport)
        .catch(() => {
          const stored = localStorage.getItem('scamshield_reports');
          if (stored) {
            const reports: Report[] = JSON.parse(stored);
            const found = reports.find((r) => r.id === Number(id));
            if (found) setReport(found);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <LoadingSpinner text="Loading report..." />
      </div>
    </section>
  );

  if (!report) return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Report not found</h2>
        <Link to="/reports" className="text-cyan-400 hover:underline">← Back to reports</Link>
      </div>
    </section>
  );

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/reports" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Back to Reports
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">Report Details</h2>
            <p className="text-sm text-gray-500">
              {new Date(report.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 mb-8">
          <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Conversation</p>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-xl border border-white/5">
            {report.conversation}
          </pre>
        </div>

        <ResultPanel result={report} />
      </div>
    </section>
  );
}
