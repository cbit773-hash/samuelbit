import { X } from 'lucide-react';
import { OrderPanel } from './OrderPanel';

interface MobileOrderSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Panel de orden en bottom sheet para viewports < lg */
export function MobileOrderSheet({ open, onClose }: MobileOrderSheetProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
        aria-label="Cerrar panel de orden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden max-h-[85vh] flex flex-col rounded-t-2xl border-t border-border bg-[#0f1117]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-sm font-bold text-foreground">Abrir operación</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground rounded-lg"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <OrderPanel variant="sheet" />
        </div>
      </div>
    </>
  );
}
