import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

interface BoltBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function BoltBadge({ className, children, ...props }: BoltBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[rgba(159,232,112,0.12)] text-[#9fe870] border border-[rgba(159,232,112,0.25)]',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
