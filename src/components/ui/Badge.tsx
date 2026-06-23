import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, dot = true, className = '' }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-white/10 rounded-full text-[10px] tracking-widest font-bold text-gray-400 uppercase ${className}`}>
      {dot && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
      {children}
    </div>
  );
}
