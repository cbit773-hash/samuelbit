import { Loader2 } from 'lucide-react';

export function WalletTabSkeleton() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="animate-spin text-cyan-500" size={32} />
      <span className="ml-3 text-muted">Cargando billetera...</span>
    </div>
  );
}
