import { useReports } from '../hooks/useReports';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { RecentAnalyses } from '../components/dashboard/RecentAnalyses';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function DashboardPage() {
  const { reports, loading } = useReports();

  const stats = {
    total: reports.length,
    safe: reports.filter((r) => r.risk_level === 'Safe').length,
    suspicious: reports.filter((r) => r.risk_level === 'Suspicious').length,
    highRisk: reports.filter((r) => r.risk_level === 'High Risk').length,
  };

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Badge className="mb-4">Dashboard Overview</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Analytics</h2>
          <p className="text-gray-400">Your scam detection activity at a glance.</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading dashboard..." />
        ) : (
          <>
            <StatsOverview
              total={stats.total}
              safe={stats.safe}
              suspicious={stats.suspicious}
              highRisk={stats.highRisk}
            />
            <div>
              <h3 className="text-2xl font-bold mb-6">Recent Analyses</h3>
              <RecentAnalyses reports={reports} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
