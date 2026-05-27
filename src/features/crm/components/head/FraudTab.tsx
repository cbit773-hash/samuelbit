import { useState } from 'react';
import { Ban, CheckCircle, Eye, AlertTriangle, Search, Zap } from 'lucide-react';

type Severity = 'low' | 'medium' | 'high' | 'critical';
type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

interface FraudAlert {
  id: string; leadName: string; leadId: string; type: string; severity: Severity;
  status: AlertStatus; evidence: string; created: string; ip?: string;
}

const initialAlerts: FraudAlert[] = [
  { id: 'FA-001', leadName: 'Jorge Díaz', leadId: 'L-009', type: 'multi_account', severity: 'high', status: 'open', evidence: '2 cuentas desde IP 189.203.xx.xx', created: '2026-04-30', ip: '189.203.45.12' },
  { id: 'FA-002', leadName: 'Anónimo VPN', leadId: 'L-015', type: 'latency_arb', severity: 'critical', status: 'open', evidence: '87 trades <50ms, profit ratio 0.96', created: '2026-04-30' },
  { id: 'FA-003', leadName: 'Roberto Díaz', leadId: 'L-005', type: 'bonus_abuse', severity: 'medium', status: 'investigating', evidence: 'Retiro $450 con solo $50 en trading volume', created: '2026-04-29' },
  { id: 'FA-004', leadName: 'Carlos Mendoza', leadId: 'L-010', type: 'chargeback_pattern', severity: 'critical', status: 'open', evidence: '3 chargebacks en 60 días, $2,100 total', created: '2026-04-28' },
  { id: 'FA-005', leadName: 'Sofía Reyes', leadId: 'L-008', type: 'multi_account', severity: 'low', status: 'resolved', evidence: 'IP compartida — oficina confirmada', created: '2026-04-25' },
];

const TYPE_LABELS: Record<string, string> = {
  bonus_abuse: 'Abuso de Bono', latency_arb: 'Arbitraje Latencia',
  multi_account: 'Multi-Cuenta (IP)', chargeback_pattern: 'Patrón Chargeback',
};

const SEVERITY_STYLES: Record<Severity, string> = {
  low: 'bg-gray-500/20 text-gray-400', medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-orange-500/20 text-orange-400', critical: 'bg-rose-500/20 text-rose-400',
};

const STATUS_STYLES: Record<AlertStatus, string> = {
  open: 'bg-rose-500/10 text-rose-400', investigating: 'bg-amber-500/10 text-amber-400',
  resolved: 'bg-emerald-500/10 text-emerald-400', false_positive: 'bg-gray-500/10 text-gray-400',
};

export function FraudTab() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | AlertStatus>('all');
  const [search, setSearch] = useState('');
  const [killTarget, setKillTarget] = useState<FraudAlert | null>(null);

  const filtered = alerts
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => a.leadName.toLowerCase().includes(search.toLowerCase()));

  const openCount = alerts.filter(a => a.status === 'open').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'open').length;

  const updateStatus = (id: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const killSwitch = (alert: FraudAlert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'resolved' } : a));
    setKillTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#060d14] border border-rose-500/20 p-4 rounded-xl text-center shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <p className="text-2xl font-black text-rose-400">{openCount}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Alertas Abiertas</p>
        </div>
        <div className="bg-[#060d14] border border-orange-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-black text-orange-400">{criticalCount}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Críticas</p>
        </div>
        <div className="bg-[#060d14] border border-amber-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-black text-amber-400">{alerts.filter(a => a.status === 'investigating').length}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">En Investigación</p>
        </div>
        <div className="bg-[#060d14] border border-emerald-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-black text-emerald-400">{alerts.filter(a => a.status === 'resolved').length}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Resueltas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {(['all', 'open', 'investigating', 'resolved', 'false_positive'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${filter === s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
            {s === 'all' ? 'Todas' : s === 'open' ? 'Abiertas' : s === 'investigating' ? 'Investigando' : s === 'resolved' ? 'Resueltas' : 'Falso Positivo'}
          </button>
        ))}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-cyan-500/30 outline-none" />
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-[#060d14] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] text-gray-500 bg-black/30 uppercase border-b border-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Severidad</th>
              <th className="px-4 py-3 text-left">Evidencia</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition ${a.severity === 'critical' && a.status === 'open' ? 'bg-rose-500/[0.03]' : ''}`}>
                <td className="px-4 py-3 font-mono text-gray-600 text-xs">{a.id}</td>
                <td className="px-4 py-3 font-bold text-white">{a.leadName}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold text-cyan-400">{TYPE_LABELS[a.type]}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${SEVERITY_STYLES[a.severity]}`}>{a.severity}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-[250px] truncate">{a.evidence}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${STATUS_STYLES[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-1">
                  {a.status === 'open' && (
                    <>
                      <button onClick={() => updateStatus(a.id, 'investigating')} title="Investigar" className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"><Eye size={13} /></button>
                      <button onClick={() => setKillTarget(a)} title="Kill Switch" className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Ban size={13} /></button>
                    </>
                  )}
                  {a.status === 'investigating' && (
                    <>
                      <button onClick={() => updateStatus(a.id, 'resolved')} title="Resolver" className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle size={13} /></button>
                      <button onClick={() => updateStatus(a.id, 'false_positive')} title="Falso Positivo" className="p-1.5 rounded-lg bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"><AlertTriangle size={13} /></button>
                      <button onClick={() => setKillTarget(a)} title="Kill Switch" className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Ban size={13} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kill Switch Modal */}
      {killTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setKillTarget(null)}>
          <div className="bg-[#0a0a0a] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.15)]" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="text-rose-500" size={28} />
            </div>
            <h3 className="text-white font-black text-xl text-center mb-2">⚠️ KILL SWITCH</h3>
            <p className="text-gray-400 text-sm text-center mb-1">Estás a punto de bloquear al usuario:</p>
            <p className="text-rose-400 font-bold text-center text-lg mb-4">{killTarget.leadName}</p>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 mb-6 text-sm">
              <p className="text-gray-400"><span className="text-gray-500">Alerta:</span> <span className="text-white">{TYPE_LABELS[killTarget.type]}</span></p>
              <p className="text-gray-400"><span className="text-gray-500">Evidencia:</span> <span className="text-white">{killTarget.evidence}</span></p>
            </div>
            <p className="text-rose-400/60 text-xs text-center mb-4">Esta acción bloqueará todas las operaciones, retiros y acceso del usuario inmediatamente. Se registrará en logs inmutables.</p>
            <div className="flex gap-3">
              <button onClick={() => setKillTarget(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition">Cancelar</button>
              <button onClick={() => killSwitch(killTarget)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-xl transition shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2">
                <Ban size={16} /> BLOQUEAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
