import { useReports } from '../hooks/useReports';
import { ReportCard } from '../components/reports/ReportCard';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export function ReportsPage() {
  const { reports, loading, deleteReport } = useReports();

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Badge className="mb-4">Report History</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Reports</h2>
          <p className="text-gray-400">View and manage your analysis reports.</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading reports..." />
        ) : reports.length === 0 ? (
          <div className="glass-card rounded-[48px] p-20 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">No reports yet</h3>
            <p className="text-gray-400 mb-8">Start by analyzing a conversation to see reports here.</p>
            <Link to="/analyze" className="inline-flex btn-gradient px-8 py-4 rounded-full font-bold">
              Analyze a conversation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} onDelete={deleteReport} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
