import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'ghost' | 'subtle' | 'buy' | 'sell';

interface BoltButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bolt-btn-primary',
  ghost: 'bolt-btn-ghost',
  subtle:
    'inline-flex items-center justify-center font-medium text-sm text-deep-graphite bg-canvas hover:bg-pale-mist/30 py-2.5 px-[15px] transition-colors',
  buy: 'inline-flex items-center justify-center font-semibold text-sm text-polar-white bg-success hover:opacity-90 rounded-pill py-[11px] px-[24px] transition-colors active:scale-[0.98]',
  sell: 'inline-flex items-center justify-center font-semibold text-sm text-polar-white bg-danger hover:opacity-90 rounded-pill py-[11px] px-[24px] transition-colors active:scale-[0.98]',
};

export function BoltButton({
  variant = 'primary',
  fullWidth,
  className,
  children,
  ...props
}: BoltButtonProps) {
  return (
    <button
      type="button"
      className={cn(variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );

}
