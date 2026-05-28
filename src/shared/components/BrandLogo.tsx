import { Link } from 'react-router-dom';
import { cn } from '../ui/cn';

const PRO_GREEN = '#9fe870';
const INVEST_WHITE = '#f5f6f4';

type BrandLogoSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<BrandLogoSize, string> = {
  sm: 'text-lg',
  md: 'text-xl md:text-2xl',
  lg: 'text-2xl sm:text-[28px]',
};

interface BrandLogoProps {
  link?: boolean;
  size?: BrandLogoSize;
  className?: string;
}

export function BrandLogo({ link = true, size = 'md', className }: BrandLogoProps) {
  const content = (
    <span
      className={cn('font-bold tracking-tight inline-flex items-baseline', sizeClass[size], className)}
    >
      <span style={{ color: INVEST_WHITE }}>Invest</span>
      <span className="font-bold" style={{ color: PRO_GREEN }}>
        PRO
      </span>
    </span>
  );

  if (!link) return content;

  return (
    <Link to="/" className="hover:opacity-90 transition-opacity" aria-label="InvestPRO inicio">
      {content}
    </Link>
  );
}
