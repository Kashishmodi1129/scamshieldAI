import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
}

export function GradientText({ children, as: Tag = 'span', className = '' }: Props) {
  return <Tag className={`text-gradient-cyan-purple ${className}`}>{children}</Tag>;
}
