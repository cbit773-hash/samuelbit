import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Level = 'display' | 'heading-lg' | 'heading' | 'subheading';

interface BoltHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  level?: Level;
  children: ReactNode;
}

const styles: Record<Level, string> = {
  display: 'font-display text-[70px] leading-none tracking-[0.02em] text-polar-white',
  'heading-lg': 'font-display text-[64px] leading-[1.1] tracking-[-0.02em] text-polar-white',
  heading: 'font-display text-[32px] leading-[1.1] tracking-[-0.02em] text-polar-white',
  subheading: 'text-[20px] leading-[1.2] font-semibold text-polar-white',
};

export function BoltHeading({
  as: Tag = 'h1',
  level = 'heading',
  className,
  children,
  ...props
}: BoltHeadingProps) {
  return (
    <Tag className={cn(styles[level], className)} {...props}>
      {children}
    </Tag>
  );
}
