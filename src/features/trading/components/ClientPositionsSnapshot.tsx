import { useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import { dbSymbolToMarket } from '../utils/symbol-map';
import { Loader2 } from 'lucide-react';

interface Props {
  clientUserId: string;
}

export function ClientPositionsSnapshot({ clientUserId }: Props) {
  const [rows, setRows] = useState<
    { symbol: string; type: string; volume: number; open_price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('positions')
      .select('symbol, type, volume, open_price')
      .eq('client_id', clientUserId)
      .eq('status', 'OPEN')
      .then(({ data }) => {
        setRows(
          (data ?? []).map((r) => ({
            symbol: dbSymbolToMarket(r.symbol as string),
            type: r.type as string,
            volume: Number(r.volume),
            open_price: Number(r.open_price),
          })),
        );
        setLoading(false);
      });
  }, [clientUserId]);

  if (loading) {
    return (
      <div className="text-muted text-xs flex items-center gap-1 py-2">
        <Loader2 size={12} className="animate-spin" /> Posiciones�
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="text-muted text-xs py-2">Sin posiciones abiertas</p>;
  }

  return (
    <div className="bg-surface-inset border border-border rounded-lg p-3 mt-3">
      <p className="text-[10px] font-bold text-muted uppercase mb-2">Posiciones abiertas (lectura)</p>
      <ul className="space-y-1 text-xs">
        {rows.map((r, i) => (
          <li key={i} className="flex justify-between font-mono">
            <span>
              {r.symbol} {r.type}
            </span>
            <span className="text-muted">
              {r.volume} @ {r.open_price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
