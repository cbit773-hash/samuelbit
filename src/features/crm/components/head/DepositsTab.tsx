import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Search, Loader2, RefreshCw } from 'lucide-react';
import { getAllDeposits, approveDeposit, rejectDeposit } from '../../../../core/supabase/services/deposits.service';
import type { Deposit } from '../../../../core/supabase/database.types';

export function DepositsTab() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const d = await getAllDeposits();
    setDeposits(d);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = deposits
    .filter(d => filterType === 'ALL' || d.type === filterType)
    .filter(d => filterStatus === 'ALL' || d.status === filterStatus)
    .filter(d => {
      const name = (d as any).client_profile?.full_name || '';
      const agent = (d as any).agent_profile?.full_name || '';
      return name.toLowerCase().includes(search.toLowerCase()) || agent.toLowerCase().includes(search.toLowerCase());
    });

  const totalApproved = deposits.filter(d => d.status === 'Aprobado').reduce((s, d) => s + Number(d.amount), 0);
  const totalPending = deposits.filter(d => d.status === 'Verificando').reduce((s, d) => s + Number(d.amount), 0);
  const pending = deposits.filter(d => d.status === 'Verificando').length;

  const handleApprove = async (id: string) => { setActionLoading(id); await approveDeposit(id); await fetchData(); setActionLoading(null); };
  const handleReject = async (id: string) => { setActionLoading(id); await rejectDeposit(id); await fetchData(); setActionLoading(null); };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={32} /><span className="ml-3 text-gray-400">Cargando depósitos...</span></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-emerald-400">${totalApproved.toLocaleString()}</p><p className="text-xs text-gray-400">Aprobado</p></div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-amber-400">${totalPending.toLocaleString()}</p><p className="text-xs text-gray-400">Pendiente</p></div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-blue-400">{pending}</p><p className="text-xs text-gray-400">Por Verificar</p></div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-white">{deposits.length}</p><p className="text-xs text-gray-400">Total (BD)</p></div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={fetchData} className="bg-cyan-500/20 text-cyan-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"><RefreshCw size={16} /> Refrescar</button>
        {['ALL', 'FTD', 'RETENCION'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filterType === t ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400'}`}>{t === 'ALL' ? 'Todos' : t}</button>
        ))}
        {['ALL', 'Verificando', 'Aprobado', 'Rechazado'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filterStatus === s ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>{s === 'ALL' ? 'Todo Status' : s}</button>
        ))}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
            <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Cliente</th><th className="px-4 py-3 text-left">Monto</th><th className="px-4 py-3 text-left">Tipo</th><th className="px-4 py-3 text-left">Agente</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Fecha</th><th className="px-4 py-3 text-left">Acc.</th></tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">{d.id.slice(0, 8)}</td>
                <td className="px-4 py-3 font-bold text-white">{(d as any).client_profile?.full_name || 'N/A'}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-500">${Number(d.amount).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded ${d.type === 'FTD' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>{d.type}</span></td>
                <td className="px-4 py-3 text-gray-300">{(d as any).agent_profile?.full_name || 'N/A'}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 w-fit ${d.status === 'Aprobado' ? 'bg-emerald-500/20 text-emerald-400' : d.status === 'Rechazado' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{d.status === 'Aprobado' ? <CheckCircle size={10} /> : d.status === 'Rechazado' ? <XCircle size={10} /> : <Clock size={10} />}{d.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-1">
                  {d.status === 'Verificando' ? (
                    <>
                      <button onClick={() => handleApprove(d.id)} disabled={actionLoading === d.id} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"><CheckCircle size={14} /></button>
                      <button onClick={() => handleReject(d.id)} disabled={actionLoading === d.id} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"><XCircle size={14} /></button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No hay depósitos.</p>}
      </div>
    </div>
  );
}
