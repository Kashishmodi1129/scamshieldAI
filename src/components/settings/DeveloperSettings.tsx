import { useState, useEffect } from 'react';
import type { DeveloperSettings as Settings } from '../../types';
import { api } from '../../services/api';

interface Props {
  settings: Settings;
  onSave: (partial: Partial<Settings>) => void;
}

export function DeveloperSettings({ settings, onSave }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLocal(settings); }, [settings]);

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testConnection({
        provider: 'groq',
        api_key: local.api_key,
        model: 'llama-3.3-70b-versatile',
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold mb-2">Developer Settings</h2>
        <p className="text-gray-400 text-sm">Configure AI provider, API keys, and detection parameters.</p>
      </div>

      <div className="space-y-8">
        {/* API Key */}
        <div className="glass-card rounded-[32px] p-8">
          <h3 className="text-lg font-bold mb-6">API Key</h3>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={local.api_key}
              onChange={(e) => handleChange('api_key', e.target.value)}
              placeholder="gsk_your_groq_api_key"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 pr-24 text-gray-300 focus:border-scam-cyan outline-none font-mono text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            onClick={handleTest}
            disabled={!local.api_key || testing}
            className="mt-4 btn-gradient px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Test API Connection'}
          </button>
          {testResult && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${
              testResult.success
                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Detection Mode */}
        <div className="glass-card rounded-[32px] p-8">
          <h3 className="text-lg font-bold mb-6">Detection Mode</h3>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'fast', label: 'Fast', desc: 'Rule engine only' },
              { value: 'balanced', label: 'Balanced', desc: 'Rule engine + LLM' },
              { value: 'deep', label: 'Deep Analysis', desc: 'Advanced LLM + detailed reporting' },
            ] as const).map((m) => (
              <button
                key={m.value}
                onClick={() => handleChange('detection_mode', m.value)}
                className={`px-4 py-4 rounded-xl text-sm font-bold border transition-all text-left ${
                  local.detection_mode === m.value
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : 'bg-slate-900/50 text-gray-500 border-white/10 hover:text-white'
                }`}
              >
                <p>{m.label}</p>
                <p className="text-[10px] font-normal opacity-70 mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Confidence Threshold */}
        <div className="glass-card rounded-[32px] p-8">
          <h3 className="text-lg font-bold mb-6">
            Confidence Threshold <span className="text-scam-cyan">{local.confidence_threshold}%</span>
          </h3>
          <input
            type="range"
            min={50}
            max={95}
            value={local.confidence_threshold}
            onChange={(e) => handleChange('confidence_threshold', Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-2">
            <span>50% (More Sensitive)</span>
            <span>95% (More Strict)</span>
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="glass-card rounded-[32px] p-8">
          <details className="group">
            <summary className="text-lg font-bold cursor-pointer list-none flex items-center justify-between">
              Advanced Prompt Configuration
              <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </summary>
            <div className="mt-6">
              <label className="block text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">System Prompt</label>
              <textarea
                value={local.custom_prompt}
                onChange={(e) => handleChange('custom_prompt', e.target.value)}
                rows={6}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-scam-cyan outline-none resize-none text-sm font-mono"
              />
            </div>
          </details>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="btn-gradient px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-green-400 text-sm font-bold animate-pulse">Settings saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
