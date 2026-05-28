import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Globe, RefreshCw, Search, Download, Loader2, UserPlus } from 'lucide-react';
import {
  getWebLeads,
  getLeadExportSignedUrl,
  countWebLeadsToday,
  countUnassignedWebLeads,
  type WebLeadWithFile,
} from '../../../../core/supabase/services/web-leads.service';
import { updateLead } from '../../../../core/supabase/services/leads.service';
import { getProfilesByRole } from '../../../../core/supabase/services/profiles.service';
import type { Profile } from '../../../../core/supabase/database.types';
import { downloadCsv } from '../../../../shared/utils/export-reports';
import { supabase } from '../../../../core/supabase/client';

type DateFilter = 'today' | 'week' | 'all' | 'unassigned';

const STATUS_COLORS: Record<string, string> = {
  Nuevo: 'bg-primary/20 text-brand',
  Contactado: 'bg-cyan-500/20 text-cyan-400',
  'En seguimiento': 'bg-primary/20 text-primary',
  'Cerca de cierre': 'bg-emerald-500/20 text-emerald-400',
  'No contesta': 'bg-rose-500/20 text-rose-400',
  'Cerrado (FTD)': 'bg-green-500/20 text-green-400',
  Descartado: 'bg-gray-500/20 text-muted',
};

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  return d.getUTCFullYear() === n.getUTCFullYear() && d.getUTCMonth() === n.getUTCMonth() && d.getUTCDate() === n.getUTCDate();
}

function isWithinWeek(iso: string): boolean {
  const diff = Date.now() - new Date(iso).getTime();
  return diff <= 7 * 24 * 60 * 60 * 1000;
}

export function WebRegistrationsTab() {
  const [leads, setLeads] = useState<WebLeadWithFile[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [todayCount, setTodayCount] = useState(0);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [list, ag, today, unassigned] = await Promise.all([
      getWebLeads(),
      getProfilesByRole('AGENT'),
      countWebLeadsToday(),
      countUnassignedWebLeads(),
    ]);
    setLeads(list);
    setAgents(ag);
    setTodayCount(today);
    setUnassignedCount(unassigned);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('web-leads-head')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
        fetchData();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const filtered = useMemo(() => {
    return leads
      .filter((l) => {
        if (dateFilter === 'today') return isToday(l.created_at);
        if (dateFilter === 'week') return isWithinWeek(l.created_at);
        if (dateFilter === 'unassigned') return !l.assigned_to && l.status !== 'Descartado';
        return true;
      })
      .filter((l) => {
        const q = search.toLowerCase();
        if (!q) return true;
        return (
          `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
          (l.email ?? '').toLowerCase().includes(q) ||
          l.phone.includes(q)
        );
      });
  }, [leads, dateFilter, search]);

  const getAgentName = (id: string | null) =>
    !id ? 'Sin asignar' : agents.find((a) => a.id === id)?.full_name || id.slice(0, 8);

  const handleReassign = async (leadId: string, agentId: string) => {
    await updateLead(leadId, { assigned_to: agentId || null });
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, assigned_to: agentId || null } : l)),
    );
    setEditingAgent(null);
    setUnassignedCount(await countUnassignedWebLeads());
  };

  const downloadLeadCsv = async (lead: WebLeadWithFile) => {
    setDownloadingId(lead.id);
    try {
      if (lead.registration_file?.storage_path) {
        const url = await getLeadExportSignedUrl(lead.registration_file.storage_path);
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
          return;
        }
      }
      downloadCsv(`registro-${lead.id}.csv`, ['campo', 'valor'], [
        ['fecha', new Date(lead.created_at).toLocaleString('es-CO')],
        ['nombre', lead.first_name],
        ['apellido', lead.last_name],
        ['email', lead.email ?? ''],
        ['telefono', lead.phone],
        ['pais', lead.country ?? ''],
        ['interes', lead.interest],
        ['notas', lead.notes ?? ''],
        ['lead_id', lead.id],
      ]);
    } finally {
      setDownloadingId(null);
    }
  };

  const exportToday = () => {
    const todayLeads = leads.filter((l) => isToday(l.created_at));
    if (todayLeads.length === 0) return;
    downloadCsv(`registros-web-${new Date().toISOString().slice(0, 10)}.csv`, [
      'fecha',
      'nombre',
      'apellido',
      'email',
      'telefono',
      'pais',
      'interes',
      'estado',
      'agente',
    ], todayLeads.map((l) => [
      new Date(l.created_at).toLocaleString('es-CO'),
      l.first_name,
      l.last_name,
      l.email ?? '',
      l.phone,
      l.country ?? '',
      l.interest,
      l.status,
      getAgentName(l.assigned_to),
    ]));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
        <span className="ml-3 text-muted">Cargando registros web...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-1">
            <Globe size={14} /> Captaci�n /registro
          </div>
          <p className="text-muted text-sm">
            Cuentas creadas desde la landing. CSV generado autom�ticamente al registrarse.
          </p>
        </div>
        <Link
          to="/registro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
        >
          Abrir landing ?
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-foreground">{leads.length}</p>
          <p className="text-xs text-muted">Total web</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-emerald-400">{todayCount}</p>
          <p className="text-xs text-muted">Hoy (UTC)</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-rose-400">{unassignedCount}</p>
          <p className="text-xs text-muted">Sin asignar</p>
        </div>
        <div className="bg-primary/10 border border-blue-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-brand">{leads.filter((l) => l.status === 'Nuevo').length}</p>
          <p className="text-xs text-muted">Estado Nuevo</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={fetchData}
          className="bg-cyan-500/20 text-cyan-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refrescar
        </button>
        <button
          type="button"
          onClick={exportToday}
          className="bg-primary/20 text-primary font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Download size={16} /> Exportar hoy
        </button>
        {(['all', 'today', 'week', 'unassigned'] as DateFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setDateFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              dateFilter === f ? 'bg-primary text-polar-white' : 'bg-surface text-muted'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'today' ? 'Hoy' : f === 'week' ? '7 d�as' : 'Sin asignar'}
          </button>
        ))}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, email, tel�fono..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground outline-none"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted bg-surface-inset uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Contacto</th>
              <th className="px-4 py-3 text-left">Pa�s</th>
              <th className="px-4 py-3 text-left">Inter�s</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Agente</th>
              <th className="px-4 py-3 text-left">Archivo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border hover:bg-surface">
                <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3 font-bold text-foreground">
                  {l.first_name} {l.last_name}
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="text-foreground font-mono">{l.phone}</div>
                  <div className="text-muted">{l.email ?? '�'}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{l.country ?? '�'}</td>
                <td className="px-4 py-3 text-foreground">{l.interest}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${STATUS_COLORS[l.status] ?? ''}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editingAgent === l.id ? (
                    <select
                      autoFocus
                      value={l.assigned_to || ''}
                      onChange={(e) => handleReassign(l.id, e.target.value)}
                      onBlur={() => setEditingAgent(null)}
                      className="bg-surface-inset border border-border text-foreground rounded px-2 py-1 text-xs outline-none"
                    >
                      <option value="">Sin asignar</option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.full_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingAgent(l.id)}
                      className={`text-left text-xs hover:text-primary ${
                        !l.assigned_to ? 'text-rose-400 font-bold' : 'text-foreground'
                      }`}
                    >
                      {getAgentName(l.assigned_to)}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={downloadingId === l.id}
                    onClick={() => downloadLeadCsv(l)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                  >
                    {downloadingId === l.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-muted text-center py-10 flex items-center justify-center gap-2">
            <UserPlus size={18} /> No hay registros web con este filtro.
          </p>
        )}
      </div>
    </div>
  );
}
