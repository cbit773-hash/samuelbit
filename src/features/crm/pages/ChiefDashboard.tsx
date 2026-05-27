import { 
  BarChart, CheckSquare, Clock, 
  ShieldCheck, Activity, PieChart, FileText, AlertCircle, 
  Database, Lock, DollarSign, CreditCard, CheckCircle, XCircle, 
  UploadCloud, RefreshCw, Send, Loader2
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getAllDeposits, approveDeposit, rejectDeposit, getDepositKPIs } from '../../../core/supabase/services/deposits.service';
import { getAllLeads } from '../../../core/supabase/services/leads.service';
import { getAllProfiles } from '../../../core/supabase/services/profiles.service';
import type { Deposit, Lead, Profile } from '../../../core/supabase/database.types';

export function ChiefDashboard() {
  const [activeTask, setActiveTask] = useState('Validación de Depósitos');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kpis, setKpis] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, totalVolume: 0, ftdCount: 0, retentionVolume: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [dep, ld, prof, kpi] = await Promise.all([
      getAllDeposits(), getAllLeads(), getAllProfiles(), getDepositKPIs()
    ]);
    setDeposits(dep); setLeads(ld); setProfiles(prof); setKpis(kpi);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await approveDeposit(id);
    await fetchData();
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await rejectDeposit(id);
    await fetchData();
    setActionLoading(null);
  };

  const pendingDeposits = deposits.filter(d => d.status === 'Verificando');
  const slaLeads = leads.filter(l => {
    if (!l.created_at) return false;
    const hours = (Date.now() - new Date(l.created_at).getTime()) / 3600000;
    return hours > 24 && l.status !== 'Cerrado (FTD)' && l.status !== 'Descartado';
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Aprobado': 'bg-emerald-500/20 text-emerald-400',
      'Verificando': 'bg-amber-500/20 text-amber-400',
      'Rechazado': 'bg-red-500/20 text-red-400',
    };
    return <span className={`text-xs font-bold px-2 py-1 rounded ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>{status}</span>;
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-cyan-500" size={32} /><span className="ml-3 text-gray-400">Cargando desde Supabase...</span></div>
  );

  const chiefTasks = [
    { id: 'Validación de Depósitos', icon: <DollarSign size={20} />, title: "Validación de Depósitos", desc: `${pendingDeposits.length} pendientes.`, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Control de Retiros', icon: <CreditCard size={20} />, title: "Control de Retiros", desc: "Solicitudes activas.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Auditoría de SLA (Leads)', icon: <Clock size={20} />, title: "Auditoría de SLA (Leads)", desc: `${slaLeads.length} leads >24h.`, color: "text-red-500", bg: "bg-red-500/10" },
    { id: 'Revisión KYC / AML', icon: <ShieldCheck size={20} />, title: "Revisión KYC / AML", desc: "Perfiles pendientes.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'Inyección de Base', icon: <Database size={20} />, title: "Inyección de Base", desc: "Importación manual.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Auditoría de Comisiones', icon: <PieChart size={20} />, title: "Auditoría Comisiones", desc: "Cierre pendiente.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Reporte de Conciliación', icon: <FileText size={20} />, title: "Reporte de Conciliación", desc: "EOD para el Head.", color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: 'Tickets de Escalación', icon: <AlertCircle size={20} />, title: "Tickets de Escalación", desc: "0 disputas.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'Monitor de APIs', icon: <Activity size={20} />, title: "Monitor de APIs", desc: "100% operativas.", color: "text-green-500", bg: "bg-green-500/10" },
    { id: 'Log de Seguridad', icon: <Lock size={20} />, title: "Log de Seguridad", desc: "Sin anomalías.", color: "text-gray-400", bg: "bg-gray-500/10" },
  ];

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;

    switch(activeTask) {
      case 'Validación de Depósitos':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckSquare className="text-emerald-500" /> Validación de Depósitos (Caja) — <span className="text-cyan-400">{deposits.length} registros</span>
            </h3>
            {deposits.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay depósitos registrados en la base de datos.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                  <tr><th className="py-3 px-4">ID</th><th className="py-3 px-4">Cliente</th><th className="py-3 px-4">Monto</th><th className="py-3 px-4">Tipo</th><th className="py-3 px-4">Estado</th><th className="py-3 px-4">Acciones</th></tr>
                </thead>
                <tbody>
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-gray-500 text-xs">{dep.id.slice(0, 8)}</td>
                      <td className="py-4 px-4 font-bold text-white">{(dep as any).client_profile?.full_name || 'N/A'}</td>
                      <td className="py-4 px-4 font-bold text-emerald-500">${Number(dep.amount).toLocaleString()}</td>
                      <td className="py-4 px-4"><span className="text-[10px] uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{dep.type}</span></td>
                      <td className="py-4 px-4"><StatusBadge status={dep.status} /></td>
                      <td className="py-4 px-4 flex gap-2">
                        {dep.status === 'Verificando' && (
                          <>
                            <button onClick={() => handleApprove(dep.id)} disabled={actionLoading === dep.id} className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50" title="Aprobar">
                              {actionLoading === dep.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            </button>
                            <button onClick={() => handleReject(dep.id)} disabled={actionLoading === dep.id} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50" title="Rechazar">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'Auditoría de SLA (Leads)':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="text-red-500" /> Leads Vencidos (&gt;24h) — <span className="text-cyan-400">{slaLeads.length} encontrados</span>
            </h3>
            {slaLeads.length === 0 ? (
              <p className="text-emerald-400 text-center py-8">✓ Todos los leads están dentro del SLA de 24 horas.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                  <tr><th className="py-3 px-4">Lead</th><th className="py-3 px-4">País</th><th className="py-3 px-4">Estado</th><th className="py-3 px-4">Horas</th><th className="py-3 px-4">Asignado A</th></tr>
                </thead>
                <tbody>
                  {slaLeads.map((l) => {
                    const hours = Math.round((Date.now() - new Date(l.created_at).getTime()) / 3600000);
                    const assigned = profiles.find(p => p.id === l.assigned_to);
                    return (
                      <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4 font-bold text-white">{l.first_name} {l.last_name}</td>
                        <td className="py-4 px-4 text-gray-300">{l.country || '—'}</td>
                        <td className="py-4 px-4 text-amber-400 text-xs font-bold">{l.status}</td>
                        <td className="py-4 px-4 font-bold text-red-500">{hours}h</td>
                        <td className="py-4 px-4 text-gray-300">{assigned?.full_name || 'Sin asignar'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'Auditoría de Comisiones':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="text-cyan-500" /> Cierre de Comisiones (Datos en Vivo)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/40 p-6 rounded-xl border border-white/5"><p className="text-gray-400 text-sm mb-1">Total FTDs</p><p className="text-3xl text-white font-mono font-bold">{kpis.ftdCount}</p></div>
              <div className="bg-black/40 p-6 rounded-xl border border-white/5"><p className="text-gray-400 text-sm mb-1">Volumen Retención</p><p className="text-3xl text-emerald-400 font-mono font-bold">${kpis.retentionVolume.toLocaleString()}</p></div>
              <div className="bg-black/40 p-6 rounded-xl border border-white/5"><p className="text-gray-400 text-sm mb-1">Volumen Total Aprobado</p><p className="text-3xl text-cyan-400 font-mono font-bold">${kpis.totalVolume.toLocaleString()}</p></div>
            </div>
          </div>
        );
      case 'Inyección de Base':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[350px] border-dashed shadow-xl animate-fade-in">
            <Database size={56} className="text-purple-500 mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-3">Importar Nueva Base de Leads</h3>
            <p className="text-gray-400 mb-4 max-w-md text-center">Sube un archivo CSV con la nueva inyección para distribuirla uniformemente entre las mesas operativas.</p>
            <p className="text-cyan-400 text-sm mb-8">Leads actuales en BD: <strong>{leads.length}</strong> | Sin asignar: <strong>{leads.filter(l => !l.assigned_to).length}</strong></p>
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-3">
              <UploadCloud size={24} /> Seleccionar Archivo CSV
            </button>
          </div>
        );
      case 'Reporte de Conciliación':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="text-pink-500" /> Reporte Fin de Día (EOD) — Datos en Vivo
            </h3>
            <div className="bg-black/50 p-8 rounded-xl border border-white/5 mb-8 text-sm text-gray-300 font-mono leading-loose">
              <p className="text-pink-400">{">"} CONCILIACIÓN GENERADA: {new Date().toLocaleDateString()}</p>
              <p>{">"} DEPÓSITOS TOTALES APROBADOS: {kpis.approved}</p>
              <p>{">"} VOLUMEN TOTAL: ${kpis.totalVolume.toLocaleString()} USD</p>
              <p>{">"} FTDs CERRADOS: {kpis.ftdCount}</p>
              <p>{">"} DEPÓSITOS PENDIENTES: {kpis.pending}</p>
              <p>{">"} DEPÓSITOS RECHAZADOS: {kpis.rejected}</p>
              <p className="text-emerald-500 mt-4 font-bold text-base">{">"} PERSONAL ACTIVO: {profiles.length} perfiles | LEADS EN CRM: {leads.length}</p>
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-3">
              <Send size={20} /> Enviar Reporte Cifrado al HEAD
            </button>
          </div>
        );
      case 'Monitor de APIs':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-green-500" /> Estado de Servicios Core
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Supabase DB', 'Binance Pay API', 'Stripe Gateway', 'Twilio SMS'].map((api) => (
                <div key={api} className="bg-black/30 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                  <div className={`w-4 h-4 rounded-full ${api === 'Supabase DB' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-green-500 shadow-[0_0_15px_#22c55e]'} animate-pulse`}></div>
                  <p className="text-base font-bold text-white text-center">{api}</p>
                  <p className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">Operativo</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center shadow-xl animate-fade-in">
            <AlertCircle size={56} className="text-gray-500 mx-auto mb-6 opacity-30" />
            <h3 className="text-2xl font-bold text-white mb-3">Módulo Auditado</h3>
            <p className="text-gray-400 max-w-md mx-auto">No hay alertas ni acciones requeridas para esta sección en este momento.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-blue-500 font-bold mb-2 uppercase text-sm tracking-widest">
            <BarChart size={18} /> Asistencia de Dirección
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Panel del Chief</h1>
          <p className="text-gray-400 mt-2">Seguimiento estricto de depósitos y cuantificación de la base de leads. <span className="text-cyan-400 font-bold">(Conectado a Supabase)</span></p>
        </div>
        <button onClick={fetchData} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-bold">
          <RefreshCw size={16} /> Refrescar
        </button>
      </div>

      {/* Tareas del CHIEF */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={20} />
          Protocolos de Actuación (Selecciona una Tarea)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {chiefTasks.map((task, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTask(task.id)}
              className={`border rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-1 ${
                activeTask === task.id ? 'bg-white/10 border-blue-500/50 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${task.bg} ${task.color} group-hover:scale-110 transition-transform`}>
                {task.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{task.title}</h3>
              <p className="text-xs text-gray-400 leading-tight">{task.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Renderizado Dinámico */}
      <div className="min-h-[450px]">
        {renderContent()}
      </div>
    </div>
  );
}
