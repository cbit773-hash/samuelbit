import { useState, useEffect, useCallback } from 'react';
import { UserPlus, RefreshCw, Search, X, Loader2 } from 'lucide-react';
import { getAllLeads, createLead, updateLead, reassignLead } from '../../../../core/supabase/services/leads.service';
import { getProfilesByRole } from '../../../../core/supabase/services/profiles.service';
import type { Lead as LeadType, LeadStatus, Profile } from '../../../../core/supabase/database.types';

const STATUS_COLORS: Record<string, string> = {
  'Nuevo': 'bg-primary/20 text-brand', 'Contactado': 'bg-cyan-500/20 text-cyan-400',
  'En seguimiento': 'bg-accent-lime/20 text-brand400', 'Cerca de cierre': 'bg-emerald-500/20 text-emerald-400',
  'No contesta': 'bg-rose-500/20 text-rose-400', 'Cerrado (FTD)': 'bg-green-500/20 text-green-400',
  'Descartado': 'bg-gray-500/20 text-muted',
};
const ALL_STATUSES: LeadStatus[] = ['Nuevo', 'Contactado', 'En seguimiento', 'Cerca de cierre', 'No contesta', 'Cerrado (FTD)', 'Descartado'];

export function LeadsTab() {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [l, a] = await Promise.all([getAllLeads(), getProfilesByRole('AGENT')]);
    setLeads(l); setAgents(a);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = leads
    .filter(l => statusFilter === 'ALL' || l.status === statusFilter)
    .filter(l => `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()));

  const getAgentName = (id: string | null) => !id ? 'Sin asignar' : agents.find(a => a.id === id)?.full_name || id.slice(0, 8);

  const handleChangeStatus = async (id: string, status: LeadStatus) => {
    await updateLead(id, { status });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setEditingStatus(null);
  };

  const handleReassign = async (leadId: string, agentId: string) => {
    await reassignLead(leadId, agentId || (null as any));
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assigned_to: agentId || null } : l));
    setEditingAgent(null);
  };

  const addLead = async () => {
    if (!newLead.first_name || !newLead.phone) return;
    const created = await createLead({ first_name: newLead.first_name, last_name: newLead.last_name, phone: newLead.phone, email: newLead.email || null });
    if (created) setLeads(prev => [created, ...prev]);
    setNewLead({ first_name: '', last_name: '', phone: '', email: '' });
    setShowAdd(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={32} /><span className="ml-3 text-muted">Cargando leads...</span></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-alt border border-border p-4 rounded-xl text-center"><p className="text-2xl font-bold text-foreground">{leads.length}</p><p className="text-xs text-muted">Total Leads</p></div>
        <div className="bg-primary/10 border border-blue-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-brand">{leads.filter(l => l.status === 'Nuevo').length}</p><p className="text-xs text-muted">Nuevos</p></div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-rose-400">{leads.filter(l => !l.assigned_to).length}</p><p className="text-xs text-muted">Sin Asignar</p></div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-emerald-400">{leads.filter(l => l.status === 'Cerrado (FTD)').length}</p><p className="text-xs text-muted">FTDs</p></div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={() => setShowAdd(true)} className="bg-accent-lime/500 hover:bg-primary-hover text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"><UserPlus size={16} /> Nuevo Lead</button>
        <button onClick={fetchData} className="bg-cyan-500/20 text-cyan-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"><RefreshCw size={16} /> Refrescar</button>
        {['ALL', 'Nuevo', 'Contactado', 'En seguimiento', 'Cerrado (FTD)'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusFilter === s ? 'bg-accent-lime/500 text-black' : 'bg-white/10 text-muted'}`}>{s === 'ALL' ? 'Todos' : s}</button>
        ))}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-surface-alt border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground outline-none" />
        </div>
      </div>

      <div className="bg-surface-alt border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted bg-surface-inset uppercase border-b border-border">
            <tr><th className="px-4 py-3 text-left">Nombre</th><th className="px-4 py-3 text-left">Teléfono</th><th className="px-4 py-3 text-left">País</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Agente</th><th className="px-4 py-3 text-left">Fecha</th></tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b border-border hover:bg-surface-inset">
                <td className="px-4 py-3 font-bold text-foreground">{l.first_name} {l.last_name}</td>
                <td className="px-4 py-3 font-mono text-foreground text-xs">{l.phone}</td>
                <td className="px-4 py-3 text-foreground">{l.country || '—'}</td>
                <td className="px-4 py-3">
                  {editingStatus === l.id ? (
                    <select autoFocus value={l.status} onChange={e => handleChangeStatus(l.id, e.target.value as LeadStatus)} onBlur={() => setEditingStatus(null)} className="bg-surface-inset border border-border text-foreground rounded px-2 py-1 text-xs outline-none">
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span onClick={() => setEditingStatus(l.id)} className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${STATUS_COLORS[l.status]}`}>{l.status}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingAgent === l.id ? (
                    <select autoFocus value={l.assigned_to || ''} onChange={e => handleReassign(l.id, e.target.value)} onBlur={() => setEditingAgent(null)} className="bg-surface-inset border border-border text-foreground rounded px-2 py-1 text-xs outline-none">
                      <option value="">Sin asignar</option>
                      {agents.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                    </select>
                  ) : (
                    <span onClick={() => setEditingAgent(l.id)} className={`cursor-pointer hover:text-brand400 ${!l.assigned_to ? 'text-rose-400 font-bold' : 'text-foreground'}`}>{getAgentName(l.assigned_to)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted text-xs">{new Date(l.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-muted text-center py-8">No se encontraron leads.</p>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-surface-inset border border-border rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6"><h3 className="text-foreground font-bold text-lg">Agregar Lead</h3><button onClick={() => setShowAdd(false)}><X size={20} className="text-muted" /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={newLead.first_name} onChange={e => setNewLead({...newLead, first_name: e.target.value})} placeholder="Nombre" className="bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-foreground outline-none" />
                <input value={newLead.last_name} onChange={e => setNewLead({...newLead, last_name: e.target.value})} placeholder="Apellido" className="bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-foreground outline-none" />
              </div>
              <input value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} placeholder="Teléfono" className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-foreground outline-none" />
            </div>
            <button onClick={addLead} disabled={!newLead.first_name || !newLead.phone} className="w-full mt-6 bg-accent-lime/500 text-black font-bold py-3 rounded-lg disabled:opacity-40">Guardar en Supabase</button>
          </div>
        </div>
      )}
    </div>
  );
}
