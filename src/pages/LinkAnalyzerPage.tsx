import { useState } from 'react';
import type { LinkAnalysis } from '../types';
import { analyzeUrl, extractUrls } from '../services/linkAnalysis';
import { useSettings } from '../hooks/useSettings';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';

const COLORS = {
  'Safe': { text: 'text-green-400', label: 'Safe Link' },
  'Suspicious': { text: 'text-yellow-400', label: 'Suspicious Link' },
  'Likely Malicious': { text: 'text-red-400', label: 'Likely Malicious' },
};

export function LinkAnalyzerPage() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<LinkAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const { settings } = useSettings();

  const hasApiKey = settings.api_key.length > 0;

  const handleAnalyze = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please paste a URL to analyze.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    if (aiEnabled && hasApiKey) {
      try {
        const res = await api.analyzeLink(trimmed, true);
        setAnalysis(res.link_analysis);
      } catch (err) {
        const fallback = analyzeUrl(trimmed);
        setAnalysis(fallback);
        setError('AI analysis failed — showing pattern-based results only.');
      }
      setAnalyzing(false);
    } else {
      setTimeout(() => {
        try {
          const result = analyzeUrl(trimmed);
          setAnalysis(result);
        } catch {
          setError('Could not parse this URL. Please check it and try again.');
        }
        setAnalyzing(false);
      }, 400);
    }
  };

  const handleExtractFromText = () => {
    const urls = extractUrls(input);
    if (urls.length === 0) {
      setError('No URLs found in the provided text.');
      return;
    }
    const result = analyzeUrl(urls[0]);
    setAnalysis(result);
    setInput(urls[0]);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const passed = analysis ? analysis.checks.filter((c) => c.passed).length : 0;
  const total = analysis ? analysis.checks.length : 0;
  const failedChecks = analysis ? analysis.checks.filter((c) => !c.passed) : [];

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-6">Link Safety Scanner</Badge>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            Scan any <span className="text-gradient-cyan-purple italic">link</span> for scams.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Paste a URL below. Our engine checks for typosquatting, suspicious TLDs, phishing patterns, URL shorteners, homograph attacks, and more.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-[40px] p-8 mb-8">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-6">
              <svg className="w-4 h-4 text-scam-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Enter a URL
            </div>

            <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    aiEnabled ? 'bg-indigo-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    aiEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-200">Enable AI Analysis</p>
                  <p className="text-[10px] text-gray-500">Powered by Groq LLM — deeper analysis</p>
                </div>
              </div>
              {aiEnabled && !hasApiKey && (
                <a
                  href="/developer-settings"
                  className="text-[10px] text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-2"
                >
                  Add API key
                </a>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste a link here... e.g. https://bit.ly/suspicious-link"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-32 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-gradient px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {analyzing ? 'Scanning...' : 'Scan Link'}
              </button>
            </div>

            <button
              onClick={handleExtractFromText}
              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
            >
              Extract first URL from pasted text
            </button>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
          </div>

          {analyzing && (
            <div className="glass-card rounded-[40px] flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">
                  {aiEnabled ? 'Running AI analysis...' : 'Analyzing URL structure...'}
                </p>
              </div>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="space-y-6">
              <div className="glass-card rounded-[40px] p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Analyzed URL</p>
                    <p className="text-sm font-mono text-white break-all">{analysis.url}</p>
                    <p className="text-xs text-gray-500 mt-1">{analysis.domain}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold ${
                      analysis.risk_level === 'Safe'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : analysis.risk_level === 'Suspicious'
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                    }`}>
                      {COLORS[analysis.risk_level].label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-2xl font-bold text-white">{analysis.risk_score}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Pattern Risk Score</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-2xl font-bold text-white">{passed}/{total}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Checks Passed</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-2xl font-bold text-white">{total - passed}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Flags Raised</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className={`text-2xl font-bold ${
                      analysis.is_shortened ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {analysis.is_shortened ? 'Yes' : 'No'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Shortened</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Issues Detected</p>
                  {failedChecks.length === 0 ? (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-green-900/10 border border-green-500/20">
                      <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
                      <div>
                        <p className="text-sm font-semibold text-green-300">✓ All {total} checks passed</p>
                        <p className="text-xs text-gray-500 mt-0.5">This link appears to be safe based on pattern analysis.</p>
                      </div>
                    </div>
                  ) : (
                    failedChecks.map((check, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-900/20 border border-red-500/30">
                        <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                        <div>
                          <p className="text-sm font-semibold text-red-300">✗ {check.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{check.detail}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {analysis.ai_explanation && (
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <p className="text-[10px] tracking-widest font-bold text-indigo-400 uppercase flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      AI Analysis
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                        <p className="text-lg font-bold text-indigo-400">{analysis.ai_risk_score ?? '-'}</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">AI Risk Score</p>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                        <p className="text-lg font-bold text-indigo-400">
                          {analysis.ai_confidence != null ? `${Math.round(analysis.ai_confidence * 100)}%` : '-'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">Confidence</p>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                        <p className={`text-lg font-bold ${
                          analysis.ai_confidence != null && analysis.ai_confidence >= 0.7
                            ? 'text-green-400'
                            : 'text-yellow-400'
                        }`}>
                          {analysis.ai_confidence != null
                            ? analysis.ai_confidence >= 0.7 ? 'Reliable' : 'Low'
                            : '-'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">Reliability</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Explanation</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{analysis.ai_explanation}</p>
                    </div>
                    {analysis.ai_tactics && analysis.ai_tactics.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Detected Tactics</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.ai_tactics.map((t, i) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-medium text-indigo-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.ai_recommendations && analysis.ai_recommendations.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Recommendations</p>
                        <ul className="space-y-1.5">
                          {analysis.ai_recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <span className="text-cyan-500 mt-0.5">→</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {!analysis && !analyzing && !error && (
            <div className="glass-card rounded-[40px] flex flex-col items-center justify-center text-center p-12 bg-slate-900/50">
              <div className="w-16 h-16 bg-cyan-900/30 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Link safety report appears here</h3>
              <p className="text-gray-400 max-w-md leading-relaxed">Paste a link above and we'll run 13 checks against it — from typosquatting and phishing keywords to homograph attacks and known scam domains.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
