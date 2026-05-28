import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

interface BoltCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated';
  children: ReactNode;
}

export function BoltCard({ variant = 'elevated', className, children, ...props }: BoltCardProps) {
  return (
    <div
      className={cn(variant === 'elevated' ? 'bolt-card-elevated' : 'bolt-card-flat', className)}
      {...props}
    >
      {children}
    </div>
  );
}
