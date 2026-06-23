import { Badge } from '../ui/Badge';

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: 'WhatsApp Scam Detection',
    desc: 'Catches urgency tactics, fake authority claims, and \'wrong number\' pig-butchering setups in everyday chats.',
  },
  {
    icon: <span className="text-xl font-bold text-cyan-500">₹</span>,
    title: 'UPI Fraud Detection',
    desc: 'Flags \'scan to receive ₹1\' QR tricks, fake refund requests, and collect-request manipulation across PhonePe/GPay/Paytm.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: 'Property Scam Alerts',
    desc: 'Spots NoBroker/OLX rental cons — \'Army officer transferred to Leh\', token advances, refundable deposits, sight-unseen flats.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: 'OTP Scam Protection',
    desc: 'Detects KYC expiry pressure, bank impersonation, Aadhaar update tricks, and APK install requests.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M10 21h4m1.83-10.17L12 8l-3.83 2.83M3 13V5a2 2 0 012-2h14a2 2 0 012 2v8M17 21H7a2 2 0 01-2-2V13h14v6a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: 'Fake Payment Screenshot Detection',
    desc: 'Identifies fake \'payment sent\' screenshot tactics buyers use before walking off with your product.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: 'Courier & Parcel Scams',
    desc: 'Surfaces \'FedEx CBI drug parcel\' calls, fake customs holds, and impersonation of delivery agents.',
  },
];

export function Features() {
  return (
    <section className="py-32 bg-scam-bg" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Badge className="mb-6">What we protect against</Badge>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            Built for every scam <span className="text-scam-cyan">India</span> sees.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Six families of fraud, one model. Trained on patterns reported to{' '}
            <span className="text-white">cybercrime.gov.in</span> and community-shared scam transcripts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-10 rounded-[32px] hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{f.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
