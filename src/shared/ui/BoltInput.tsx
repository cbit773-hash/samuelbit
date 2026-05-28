import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

interface BoltInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function BoltInput({ icon, className, ...props }: BoltInputProps) {
  if (icon) {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          {icon}
        </span>
        <input className={cn('bolt-input pl-10', className)} {...props} />
      </div>
    );
  }
  return <input className={cn('bolt-input', className)} {...props} />;
}
