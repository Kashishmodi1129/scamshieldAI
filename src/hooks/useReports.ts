import { useState, useEffect, useCallback } from 'react';
import type { Report } from '../types';
import { api } from '../services/api';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch {
      const stored = localStorage.getItem('scamshield_reports');
      if (stored) setReports(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const deleteReport = useCallback(async (id: number) => {
    try {
      await api.deleteReport(id);
    } catch { /* ignore */ }
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reports, loading, deleteReport, refresh: fetchReports };
}
