import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 hero-gradient overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full" />
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-900/50 border border-white/10 rounded-full text-[10px] tracking-[0.2em] font-bold text-gray-300 uppercase mb-8">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          AI-Powered &nbsp;·&nbsp; India-Focused &nbsp;·&nbsp; Real-Time
        </div>
        <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
          Detect scams <span className="text-gradient-cyan-purple">before</span><br />
          <span className="text-white">you lose money.</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          AI-powered protection against <span className="text-white font-medium">WhatsApp, UPI, property, OTP,</span> and online payment scams in India.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/analyze"
            className="btn-gradient px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" fillRule="evenodd" />
            </svg>
            Analyze a chat now <span className="opacity-70">→</span>
          </Link>
          <button className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors">
            Explore protections
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-24">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 23.852l1.337-4.883C.521 17.51 0 15.787 0 14c0-4.962 4.037-9 9-9s9 4.038 9 9-4.037 9-9 9c-1.63 0-3.21-.444-4.595-1.28L.057 23.852zM9 6.545c-4.113 0-7.455 3.342-7.455 7.455 0 1.666.545 3.23 1.564 4.498l-.82 2.998 3.09-.81c1.22.75 2.628 1.144 4.067 1.144 4.113 0 7.455-3.342 7.455-7.455S13.113 6.545 9 6.545z" />
            </svg>
            WhatsApp
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-500">₹</span> UPI / PhonePe / GPay
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            NoBroker / 99acres
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            OTP / KYC
          </div>
        </div>
      </div>
    </section>
  );
}
