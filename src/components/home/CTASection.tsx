import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="pb-32 bg-scam-bg px-6">
      <div className="max-w-5xl mx-auto glass-card rounded-[48px] p-20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-purple-950/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8">
            Don&apos;t be the next <span className="text-gradient-cyan-purple">headline.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            30 seconds with ScamShield could save you ₹50,000. Paste any chat that feels off — we&apos;ll tell you straight.
          </p>
          <Link
            to="/analyze"
            className="inline-flex btn-gradient px-10 py-5 rounded-full font-bold items-center justify-center gap-3 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 transition-all text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" fillRule="evenodd" />
            </svg>
            Run a free analysis
          </Link>
        </div>
      </div>
    </section>
  );
}
