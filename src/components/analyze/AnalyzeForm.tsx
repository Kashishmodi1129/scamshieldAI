import { useState, type FormEvent } from 'react';
import type { TabType } from '../../types';

interface Props {
  tab: TabType;
  onAnalyze: (text: string) => void;
  loading: boolean;
}

export function AnalyzeForm({ tab, onAnalyze, loading }: Props) {
  const [conversation, setConversation] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = tab === 'email'
      ? `From: ${sender}\nSubject: ${subject}\n\n${conversation}`
      : conversation;
    onAnalyze(body);
  };

  const fillSample = (type: string) => {
    if (type === 'sbi') {
      setSender('SBI Alert <alerts@sbi-secure.com>');
      setSubject('URGENT: Your account will be blocked');
      setConversation('Dear Customer,\n\nYour KYC has expired. Click the link below to update immediately...\n\nhttp://sbi-secure-update.xyz/login');
    } else if (type === 'income-tax') {
      setSender('Income Tax Dept <refund@incometax.gov.in>');
      setSubject('Tax Refund Pending - Action Required');
      setConversation('Dear Taxpayer,\n\nYou have a pending refund of ₹45,780. Click the link to claim:\n\nhttp://income-tax-refund.xyz/claim');
    } else if (type === 'genuine') {
      setSender('newsletter@example.com');
      setSubject('Your Weekly Tech Roundup');
      setConversation('Hi there,\n\nHere are this week\'s top tech stories...\n\nBest,\nEditor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tab === 'email' && (
        <>
          <div>
            <label className="block text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">From (Sender)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-300 focus:border-scam-cyan outline-none"
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="sender@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">Subject</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-300 focus:border-scam-cyan outline-none"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
          </div>
        </>
      )}
      <div>
        <label className="block text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-2">
          {tab === 'email' ? 'Email Body' : 'Conversation Text'}
        </label>
        <textarea
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-scam-cyan outline-none resize-none min-h-[160px]"
          rows={6}
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder={tab === 'email' ? 'Paste email body here...' : 'Paste WhatsApp / chat conversation here...'}
        />
      </div>
      {tab === 'email' && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-gray-500">Try:</span>
          <button type="button" onClick={() => fillSample('sbi')} className="px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
            ▶ SBI &apos;KYC expired&apos;
          </button>
          <button type="button" onClick={() => fillSample('income-tax')} className="px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
            ▶ Income Tax &apos;refund&apos;
          </button>
          <button type="button" onClick={() => fillSample('genuine')} className="px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
            ▶ Genuine newsletter
          </button>
        </div>
      )}
      {tab === 'chat' && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-gray-500">Try:</span>
          <button type="button" onClick={() => setConversation('Hey, I\'m an Army officer posted in Leh. Need to rent my flat urgently. Send ₹25,000 as token advance to confirm.')} className="px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
            ▶ Army rental scam
          </button>
          <button type="button" onClick={() => setConversation('Your KYC is about to expire. Click here to update: http://fake-sbi-update.xyz')} className="px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
            ▶ KYC link scam
          </button>
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !conversation.trim()}
        className="w-full btn-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Check {tab === 'email' ? 'Email Trust' : 'Chat Safety'}
          </>
        )}
      </button>
    </form>
  );
}
