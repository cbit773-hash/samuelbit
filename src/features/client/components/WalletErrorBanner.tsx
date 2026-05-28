import { AlertCircle, RefreshCw } from 'lucide-react';

interface WalletErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function WalletErrorBanner({ message, onRetry }: WalletErrorBannerProps) {
  return (
    <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-start gap-3 flex-1">
        <AlertCircle className="text-red-400 shrink-0" size={20} />
        <p className="text-sm text-red-400 font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-foreground bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-lg shrink-0"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  );
}
