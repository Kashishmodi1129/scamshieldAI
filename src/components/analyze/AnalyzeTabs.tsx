import type { TabType } from '../../types';

interface Props {
  active: TabType;
  onChange: (tab: TabType) => void;
}

export function AnalyzeTabs({ active, onChange }: Props) {
  return (
    <div className="flex justify-center mb-12">
      <div className="p-1 bg-slate-900 rounded-2xl flex border border-white/5">
        <button
          onClick={() => onChange('email')}
          className={`px-6 py-3 font-bold flex items-center gap-2 rounded-xl transition-all ${
            active === 'email'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Email check
        </button>
        <button
          onClick={() => onChange('chat')}
          className={`px-6 py-3 font-bold flex items-center gap-2 rounded-xl transition-all ${
            active === 'chat'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Chat check
        </button>
      </div>
    </div>
  );
}
