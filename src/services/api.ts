const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export const api = {
  analyze: (conversation: string) =>
    request<{ result: import('../types').AnalysisResult; report_id: number }>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ conversation }),
    }),

  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${API_BASE}/upload`, { method: 'POST', body: form }).then((r) => r.json());
  },

  getReports: () => request<import('../types').Report[]>('/reports'),

  getReport: (id: number) => request<import('../types').Report>(`/reports/${id}`),

  deleteReport: (id: number) => request<void>(`/reports/${id}`, { method: 'DELETE' }),

  getSettings: () =>
    request<import('../types').DeveloperSettings>('/developer/settings'),

  saveSettings: (settings: Partial<import('../types').DeveloperSettings>) =>
    request<import('../types').DeveloperSettings>('/developer/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  testConnection: (settings: { provider: string; api_key: string; model: string }) =>
    request<{ success: boolean; message: string }>('/developer/test-connection', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  analyzeLink: (url: string) =>
    request<{ link_analysis: import('../types').LinkAnalysis }>('/analyze-link', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  getStats: () => request<import('../types').DashboardStats>('/stats'),
};
