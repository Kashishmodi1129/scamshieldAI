import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-scam-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ScamShield <span className="text-scam-cyan">AI</span></h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">INDIA · V1.0</p>
          </div>
        </Link>

        {isHome && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#analyzer" className="hover:text-white transition-colors">Analyzer</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/link-analyzer" className="hover:text-white transition-colors">Link Scan</Link>
            <Link to="/reports" className="hover:text-white transition-colors">Reports</Link>
          </nav>
        )}

        {!isHome && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/analyze" className="hover:text-white transition-colors">Analyze</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/link-analyzer" className="hover:text-white transition-colors">Link Scan</Link>
            <Link to="/reports" className="hover:text-white transition-colors">Reports</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/developer-settings"
            className="text-xs text-gray-500 hover:text-white transition-colors"
            title="Developer Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </Link>
          <Link
            to="/analyze"
            className="btn-gradient px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Analyze <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
