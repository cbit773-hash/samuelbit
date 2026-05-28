import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { darkUi } from '../theme/dark-ui';
import { cn } from './cn';

interface BoltNavLinkProps extends LinkProps {
  active?: boolean;
  children: ReactNode;
  dark?: boolean;
}

export function BoltNavLink({ active, dark: _dark, className, children, ...props }: BoltNavLinkProps) {
  return (
    <Link
      className={cn(
        'text-sm font-medium transition-colors',
        active ? 'text-[#9fe870] font-semibold' : `${darkUi.textSecondary} hover:text-[#9fe870]`,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
