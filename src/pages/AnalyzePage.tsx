import { useState } from 'react';
import type { TabType } from '../types';
import { useSettings } from '../hooks/useSettings';
import { useAnalysis } from '../hooks/useAnalysis';
import { AnalyzeTabs } from '../components/analyze/AnalyzeTabs';
import { AnalyzeForm } from '../components/analyze/AnalyzeForm';
import { ResultPanel } from '../components/analyze/ResultPanel';
import { ScreenshotUpload } from '../components/analyze/ScreenshotUpload';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';

export function AnalyzePage() {
  const [tab, setTab] = useState<TabType>('email');
  const { settings } = useSettings();
  const { result, error, analyze } = useAnalysis(settings);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (conversation: string) => {
    setIsAnalyzing(true);
    await analyze(conversation);
    setIsAnalyzing(false);
  };

  const handleTextFromOCR = (text: string) => {
    setTab('chat');
    handleAnalyze(text);
  };

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-6">Scam Analysis Dashboard</Badge>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            The <span className="text-gradient-cyan-purple italic">verdict</span> in seconds.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Check a chat conversation or an email. Our model dissects urgency cues, payment pressure, fake authority and phishing patterns — then ranks the threat.
          </p>
        </div>

        <AnalyzeTabs active={tab} onChange={setTab} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[40px]">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-8">
              <svg className="w-4 h-4 text-scam-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {tab === 'email' ? 'Email Trust Check' : 'Chat Safety Check'}
            </div>
            <h3 className="text-3xl font-bold mb-4">
              {tab === 'email' ? 'Is this email trustable?' : 'Is this conversation safe?'}
            </h3>
            <p className="text-gray-500 mb-8">
              {tab === 'email'
                ? "Paste a suspicious email. We'll tell you if it's safe to act on, cautious territory, or a phishing attempt."
                : "Paste a chat conversation. We'll detect scam patterns, urgency, and social engineering tactics."}
            </p>
            <AnalyzeForm tab={tab} onAnalyze={handleAnalyze} loading={isAnalyzing} />
            <ScreenshotUpload onTextExtracted={handleTextFromOCR} />
          </div>

          <div>
            {isAnalyzing && (
              <div className="glass-card rounded-[40px] flex items-center justify-center min-h-[400px]">
                <LoadingSpinner text="Analyzing conversation..." />
              </div>
            )}
            {!isAnalyzing && result && (
              <ResultPanel result={result} />
            )}
            {!isAnalyzing && !result && !error && (
              <div className="glass-card rounded-[40px] flex flex-col items-center justify-center text-center p-10 bg-slate-900/50 min-h-[400px]">
                <div className="w-16 h-16 bg-cyan-900/30 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Trust verdict appears here</h3>
                <p className="text-gray-400 max-w-xs leading-relaxed">Enter conversation details on the left — get a trust score with the exact reasons.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
