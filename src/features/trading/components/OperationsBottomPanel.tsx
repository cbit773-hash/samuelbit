import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Briefcase,
  History,
  Clock,
  PieChart,
  XCircle,
  Loader2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useTradingPositions } from '../context/TradingPositionsContext';
import { useTradingStore, useSymbolPrice, type StorePosition } from '../store/trading.store';
import { ClientPositionsTable } from './ClientPositionsTable';
import { getMyPendingOrders, cancelPendingOrder } from '../../../core/supabase/services/orders.service';
import type { PendingOrder } from '../../../core/supabase/services/orders.service';
import { calcFloatingPnl } from '../utils/position-mappers';
import { boltTheme } from '../../../shared/theme/bolt-theme';
import { PendingOrderForm } from './PendingOrderForm';
import { dbSymbolToMarket } from '../utils/symbol-map';
import { getMarginRiskState } from '../utils/margin-risk';

type Tab = 'open' | 'closed' | 'pending' | 'summary';

function OpenPositionRow({
  pos,
  selected,
  rowClosing,
  onSelect,
  onClose,
}: {
  pos: StorePosition;
  selected: boolean;
  rowClosing: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const price = useSymbolPrice(pos.symbol);
  const pnl = calcFloatingPnl(pos, price ?? null);
  const displaySymbol = pos.symbol.replace('USDT', '/USDT');

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pos.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(pos.id);
        }
      }}
      className={`border-t border-border cursor-pointer transition-colors ${
        selected
          ? 'bg-primary/10 border-l-2 border-l-primary'
          : 'hover:bg-surface border-l-2 border-l-transparent'
      }`}
    >
      <td className="px-3 py-2 font-mono text-xs">{displaySymbol}</td>
      <td className={`text-xs ${pos.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {pos.type}
      </td>
      <td className="px-3 py-2 font-mono text-xs">{pos.volume}</td>
      <td className="px-3 py-2 font-mono text-xs">{pos.openPrice.toFixed(2)}</td>
      <td className="px-3 py-2 text-muted text-xs">
        {pos.stopLoss ?? '—'} / {pos.takeProfit ?? '—'}
      </td>
      <td
        className={`px-3 py-2 text-sm font-mono tabular-nums min-w-[88px] ${
          pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {pnl >= 0 ? '+' : ''}
        {pnl.toFixed(2)}
      </td>
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          disabled={rowClosing}
          onClick={(e) => {
            e.stopPropagation();
            onClose(pos.id);
          }}
          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 text-[11px] font-semibold disabled:opacity-50"
          aria-label={`Cerrar posición ${pos.type} ${displaySymbol}`}
        >
          {rowClosing ? (
            <Loader2 className="animate-spin" size={14} aria-hidden />
          ) : (
            <XCircle size={14} aria-hidden />
          )}
          Cerrar
        </button>
      </td>
    </tr>
  );
}

function EmptyOpenState({
  symbol,
  accountMode,
  onOperate,
}: {
  symbol: string;
  accountMode: 'demo' | 'live';
  onOperate?: () => void;
}) {
  const label = symbol.replace('USDT', '/USDT');
  const isDemo = accountMode === 'demo';
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <Briefcase className="text-muted mb-3" size={32} />
      <p className="text-sm text-foreground font-semibold">
        {isDemo ? 'Abre tu primera operación demo' : 'No tienes operaciones abiertas'}
      </p>
      <p className="text-xs text-muted mt-1 max-w-xs">
        {isDemo
          ? 'Fondos virtuales sin riesgo real. Usa el panel de orden para comprar o vender.'
          : 'Selecciona un instrumento y abre tu primera posición desde el panel de orden.'}
      </p>
      {onOperate && (
        <button
          type="button"
          onClick={onOperate}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-polar-white text-xs font-bold hover:bg-primary-hover lg:hidden"
        >
          Operar en {label}
        </button>
      )}
    </div>
  );
}

interface OperationsBottomPanelProps {
  onOpenMobileOrder?: () => void;
}

export function OperationsBottomPanel({ onOpenMobileOrder }: OperationsBottomPanelProps) {
  const [tab, setTab] = useState<Tab>('open');
  const [filterByActiveSymbol, setFilterByActiveSymbol] = useState(true);
  const [closingRowId, setClosingRowId] = useState<string | null>(null);
  const { closedPositions, loading, saving, closePosition, refresh, error } =
    useTradingPositions();
  const storePositions = useTradingStore((s) => s.positions);
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const selectedPositionId = useTradingStore((s) => s.selectedPositionId);
  const setSelectedPositionId = useTradingStore((s) => s.setSelectedPositionId);
  const activePrice = useTradingStore((s) => s.currentPrice);
  const prices = useTradingStore((s) => s.prices);
  const accountMode = useTradingStore((s) => s.accountMode);
  const balance = useTradingStore((s) => s.balance);
  const equity = useTradingStore((s) => s.equity);
  const usedMargin = useTradingStore((s) => s.usedMargin);
  const freeMargin = useTradingStore((s) => s.freeMargin);
  const marginLevel = useTradingStore((s) => s.marginLevel);
  const floatingPnl = useTradingStore((s) => s.floatingPnl);

  const [pending, setPending] = useState<PendingOrder[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const loadPending = useCallback(async () => {
    setPendingLoading(true);
    const rows = await getMyPendingOrders(accountMode);
    setPending(rows);
    setPendingLoading(false);
  }, [accountMode]);

  useEffect(() => {
    if (tab === 'pending') loadPending();
  }, [tab, loadPending]);

  const openAll = storePositions.filter((p) => p.status === 'OPEN');
  const openOnSymbol = openAll.filter((p) => p.symbol === activeSymbol);
  const visibleOpen = filterByActiveSymbol ? openOnSymbol : openAll;
  const activeLabel = activeSymbol.replace('USDT', '/USDT');

  const handleCloseRow = async (id: string) => {
    const pos = storePositions.find((p) => p.id === id);
    if (!pos) return;
    const closePrice =
      prices[pos.symbol] ?? (pos.symbol === activeSymbol ? activePrice : null);
    if (closePrice == null || !Number.isFinite(closePrice)) return;
    setClosingRowId(id);
    try {
      await closePosition(id, closePrice);
      if (selectedPositionId === id) {
        setSelectedPositionId(null);
      }
    } finally {
      setClosingRowId(null);
    }
  };

  const openTabLabel =
    filterByActiveSymbol && openAll.length > openOnSymbol.length
      ? `Abiertas (${openOnSymbol.length} en ${activeLabel} / ${openAll.length} total)`
      : `Abiertas (${openAll.length})`;

  const tabs: { id: Tab; label: string; icon: typeof Briefcase }[] = [
    { id: 'open', label: openTabLabel, icon: Briefcase },
    { id: 'closed', label: `Cerradas (${closedPositions.length})`, icon: History },
    { id: 'pending', label: `Pendientes (${pending.length})`, icon: Clock },
    { id: 'summary', label: 'Resumen', icon: PieChart },
  ];

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  const friendlyError =
    error?.includes('permission denied') || error?.includes('42501')
      ? 'Sincronizando datos de tu cuenta… Si persiste, contacta a soporte.'
      : error;

  const riskState = getMarginRiskState(marginLevel);
  const riskBanner =
    riskState === 'margin_call' || riskState === 'stop_out'
      ? 'Margin call: cierra posiciones o deposita fondos. Nuevas órdenes bloqueadas.'
      : riskState === 'alert'
        ? 'Alerta de margen: nivel por debajo del 200%.'
        : null;

  return (
    <div
      className="shrink-0 flex flex-col border-t min-h-[180px] max-h-[32vh]"
      style={{ background: boltTheme.bgPanel, borderColor: boltTheme.border }}
    >
      {riskBanner && (
        <div
          className={`px-3 py-2 text-xs font-bold text-center shrink-0 ${
            riskState === 'stop_out' || riskState === 'margin_call'
              ? 'bg-rose-500/20 text-rose-300'
              : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {riskBanner}
        </div>
      )}
      <div
        className="flex items-center justify-between border-b shrink-0"
        style={{ borderColor: boltTheme.border }}
      >
        <div className="flex overflow-x-auto flex-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-blue-500 text-foreground'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
        {onOpenMobileOrder && (
          <button
            type="button"
            onClick={onOpenMobileOrder}
            className="lg:hidden shrink-0 mx-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-polar-white text-xs font-bold"
            aria-label="Abrir panel de orden"
          >
            Operar
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-auto text-xs min-h-0 scrollbar-thin">
        {friendlyError && (
          <p className="px-4 py-2 text-primary text-xs bg-primary/10 border-b border-primary/20">
            {friendlyError}
          </p>
        )}
        {tab === 'open' &&
          (loading ? (
            <div className="flex items-center justify-center py-10 text-muted">
              <Loader2 className="animate-spin mr-2" size={18} />
              Cargando posiciones…
            </div>
          ) : openAll.length === 0 ? (
            <EmptyOpenState
              symbol={activeSymbol}
              accountMode={accountMode}
              onOperate={onOpenMobileOrder}
            />
          ) : (
            <>
              <div
                className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
                style={{ borderColor: boltTheme.border }}
              >
                <button
                  type="button"
                  onClick={() => setFilterByActiveSymbol(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    filterByActiveSymbol
                      ? 'bg-primary text-polar-white'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  Solo {activeLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterByActiveSymbol(false)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    !filterByActiveSymbol
                      ? 'bg-primary text-polar-white'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  Todas
                </button>
              </div>
              {visibleOpen.length === 0 ? (
                <p className="px-4 py-8 text-center text-muted text-xs">
                  No hay posiciones abiertas en {activeLabel}. Cambia a &quot;Todas&quot; o elige
                  otro instrumento.
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead className="text-[10px] text-muted uppercase bg-surface-inset sticky top-0 z-[1]">
                    <tr>
                      <th className="px-3 py-1.5">Símbolo</th>
                      <th className="px-3 py-1.5">Tipo</th>
                      <th className="px-3 py-1.5">Cant.</th>
                      <th className="px-3 py-1.5">Apertura</th>
                      <th className="px-3 py-1.5">SL/TP</th>
                      <th className="px-3 py-1.5 min-w-[88px]">P&L</th>
                      <th className="px-3 py-1.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOpen.map((pos) => (
                      <OpenPositionRow
                        key={pos.id}
                        pos={pos}
                        selected={selectedPositionId === pos.id}
                        rowClosing={closingRowId === pos.id || saving}
                        onSelect={setSelectedPositionId}
                        onClose={(id) => void handleCloseRow(id)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ))}
        {tab === 'closed' && (
          <div className="p-2">
            <ClientPositionsTable
              positions={closedPositions}
              showClosePrice
              emptyMessage="Aún no has cerrado operaciones"
            />
          </div>
        )}
        {tab === 'pending' && (
          <>
            <PendingOrderForm onPlaced={loadPending} />
            <table className="w-full">
              <thead className="text-[10px] text-muted uppercase">
                <tr>
                  <th className="px-3 py-1.5">Símbolo</th>
                  <th className="px-3 py-1.5">Lado</th>
                  <th className="px-3 py-1.5">Tipo</th>
                  <th className="px-3 py-1.5">Precio</th>
                  <th className="px-3 py-1.5">Vol</th>
                  <th className="px-3 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {pendingLoading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted">
                      <Loader2 className="inline animate-spin" size={16} />
                    </td>
                  </tr>
                ) : pending.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">
                      Sin órdenes pendientes en modo {accountMode === 'demo' ? 'Demo' : 'Real'}
                    </td>
                  </tr>
                ) : (
                  pending.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-3 py-2 font-mono">{dbSymbolToMarket(o.symbol)}</td>
                      <td>{o.side}</td>
                      <td>{o.order_type}</td>
                      <td className="font-mono">{Number(o.trigger_price).toFixed(2)}</td>
                      <td>{o.volume}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="text-rose-400 text-xs font-bold"
                          onClick={async () => {
                            await cancelPendingOrder(o.id);
                            loadPending();
                          }}
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
        {tab === 'summary' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SummaryCard
                icon={<Wallet size={16} />}
                label={accountMode === 'demo' ? 'Balance demo' : 'Balance'}
                value={fmt(balance)}
                hint={
                  accountMode === 'demo'
                    ? 'Fondos virtuales ($10,000 iniciales)'
                    : 'Fondos depositados en cuenta real'
                }
              />
              <SummaryCard
                icon={<TrendingUp size={16} />}
                label="Capital"
                value={fmt(equity)}
                hint="Balance + P&L de posiciones abiertas"
              />
              <SummaryCard
                label="Margen libre"
                value={fmt(freeMargin)}
                valueClass="text-emerald-400"
                hint="Disponible para nuevas operaciones"
              />
              <SummaryCard
                label="PnL abierto"
                value={fmt(floatingPnl)}
                valueClass={floatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted pt-2 border-t border-border">
              <span>
                Posiciones abiertas en {activeLabel}:{' '}
                <strong className="text-foreground">{openOnSymbol.length}</strong>
              </span>
              <span>
                Margen usado: <strong className="text-foreground">{fmt(usedMargin)}</strong>
              </span>
              <span>
                Nivel margen: <strong className="text-foreground">{marginLevel.toFixed(1)}%</strong>
              </span>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          refresh();
          if (tab === 'pending') loadPending();
        }}
        className="sr-only"
        aria-hidden
      >
        Actualizar
      </button>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  valueClass = 'text-foreground',
  hint,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  valueClass?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-surface-inset/25 border border-border p-3">
      <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase font-bold">
        {icon}
        {label}
      </div>
      <p className={`font-mono font-bold text-base mt-1 ${valueClass}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted mt-1 leading-snug">{hint}</p>}
    </div>
  );
}
