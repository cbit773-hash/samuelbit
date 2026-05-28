import { formatPen, formatUsd, getPenUsdRate, usdToPen } from '../utils/currency-pe';

interface CurrencyAmountProps {
  amountUsd: number;
  showPen?: boolean;
  rate?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CurrencyAmount({
  amountUsd,
  showPen = true,
  rate = getPenUsdRate(),
  className = '',
  size = 'md',
}: CurrencyAmountProps) {
  const sizeClass =
    size === 'lg' ? 'text-2xl font-black' : size === 'sm' ? 'text-xs' : 'text-base font-bold';

  return (
    <span className={`font-mono ${sizeClass} ${className}`}>
      <span className="text-foreground">{formatUsd(amountUsd)}</span>
      {showPen && (
        <span className="text-muted font-normal text-[0.85em] ml-1.5">
          ≈ {formatPen(usdToPen(amountUsd, rate))}
        </span>
      )}
    </span>
  );
}
