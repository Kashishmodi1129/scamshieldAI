import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`glass-card rounded-[40px] p-10 ${hover ? 'hover:border-cyan-500/30 transition-all group' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
