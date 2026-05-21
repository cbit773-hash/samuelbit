import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, ArrowRightLeft, BarChart, AlertTriangle, Trophy, ShieldAlert, Zap, Activity, Globe, ArrowUpRight, ArrowDownRight, Loader2, Users } from 'lucide-react';
import { getAllDeposits, getDepositKPIs } from '../../../../core/supabase/services/deposits.service';
import { getAllLeads } from '../../../../core/supabase/services/leads.service';
import { getAllProfiles } from '../../../../core/supabase/services/profiles.service';
import type { Deposit, Profile } from '../../../../core/supabase/database.types';

export function OverviewTab() {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [depositIdx, setDepositIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Live data
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kpis, setKpis] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, totalVolume: 0, ftdCount: 0, retentionVolume: 0 });
  const [leadCount, setLeadCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [dep, prof, kpi, leads] = await Promise.all([
      getAllDeposits(), getAllProfiles(), getDepositKPIs(),
      (async () => { const l = await import('../../../../core/supabase/services/leads.service'); return (await l.getAllLeads()).length; })()
    ]);
    setDeposits(dep); setProfiles(prof); setKpis(kpi); setLeadCount(leads);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Deposit ticker animation
  useEffect(() => {
    if (deposits.length === 0) return;
    const interval = setInterval(() => {
      setDepositIdx(prev => (prev + 1) % deposits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [deposits.length]);

  // Compute agent rankings from deposits
  const agentRankings = profiles
    .filter(p => p.role === 'AGENT')
    .map(agent => {
      const agentDeposits = deposits.filter(d => d.agent_id === agent.id && d.status === 'Aprobado');
      const ftds = agentDeposits.filter(d => d.type === 'FTD').length;
      const revenue = agentDeposits.reduce((s, d) => s + Number(d.amount), 0);
      return { name: agent.full_name, ftds, goal: 15, revenue };
    })
    .sort((a, b) => b.ftds - a.ftds)
    .slice(0, 5);

  // Dynamic alerts from real data
  const alerts = [
    ...(kpis.pending > 0 ? [{ type: 'warning', msg: `${kpis.pending} depósitos pendientes de aprobación`, time: 'En vivo' }] : []),
    ...(leadCount > 0 ? [{ type: 'info', msg: `${leadCount} leads totales en el CRM`, time: 'En vivo' }] : []),
    { type: 'info', msg: `${profiles.filter(p => p.role === 'AGENT').length} agentes activos en el sistema`, time: 'En vivo' },
    ...(kpis.rejected > 0 ? [{ type: 'danger', msg: `${kpis.rejected} depósitos rechazados este período`, time: 'En vivo' }] : []),
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={32} /><span className="ml-3 text-gray-400">Cargando datos en vivo de Supabase...</span></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Server Status Bar */}
      <div className="flex items-center justify-between bg-[#060d14] border border-cyan-500/10 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Supabase</span>
          <span className="text-xs font-mono text-emerald-400">CONECTADO</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Users size={12} className="text-cyan-400" /> Perfiles: <span className="text-cyan-400 font-mono">{profiles.length}</span></span>
          <span className="flex items-center gap-1"><Globe size={12} /> Depósitos: <span className="text-white font-mono">{deposits.length}</span></span>
          <span className="font-mono text-gray-600">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Volumen Aprobado', value: `$${kpis.totalVolume.toLocaleString()}`, glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
          { icon: TrendingUp, label: 'Total FTDs', value: String(kpis.ftdCount), glow: 'shadow-[0_0_20px_rgba(0,229,255,0.1)]', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
          { icon: ArrowRightLeft, label: 'Retención (Upsells)', value: `$${kpis.retentionVolume.toLocaleString()}`, glow: '', border: 'border-blue-500/20', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
          { icon: BarChart, label: 'Depósitos Pendientes', value: String(kpis.pending), glow: '', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-[#060d14] border ${kpi.border} p-5 rounded-2xl flex items-center gap-4 ${kpi.glow} transition-all hover:scale-[1.02]`}>
            <div className={`${kpi.iconBg} p-3 rounded-xl`}>
              <kpi.icon className={kpi.iconColor} size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-black text-white tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Panel */}
        <div className="bg-[#060d14] border border-rose-500/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" />
            <h3 className="text-white font-bold text-sm">Panel de Riesgo</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs font-semibold">Net Exposure</span>
              <span className="text-xl font-black text-white font-mono">${kpis.totalVolume.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-2 rounded-full" style={{ width: `${Math.min((kpis.totalVolume / 200000) * 100, 100)}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-lg font-bold text-emerald-400 font-mono">{kpis.approved}</p>
                <p className="text-[10px] text-gray-500">Aprobados</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-lg font-bold text-rose-400 font-mono">{kpis.rejected}</p>
                <p className="text-[10px] text-gray-500">Rechazados</p>
              </div>
            </div>
            <button
              onClick={() => setEmergencyActive(!emergencyActive)}
              className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                emergencyActive
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              <Zap size={16} />
              {emergencyActive ? '⚠ EMERGENCY STOP ACTIVO' : 'Emergency Stop'}
            </button>
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-[#060d14] border border-cyan-500/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <h3 className="text-white font-bold text-sm">Top Agentes (BD)</h3>
            <span className="ml-auto text-[10px] text-cyan-400 font-mono">SUPABASE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="p-4 flex flex-col gap-4">
            {agentRankings.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">Sin agentes con depósitos registrados.</p>
            ) : agentRankings.map((a, i) => {
              const pct = Math.round((a.ftds / a.goal) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-xs font-black w-5 ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : 'text-gray-600'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-white text-sm font-bold truncate">{a.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">${a.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{a.ftds}/{a.goal} FTDs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Deposit Stream */}
        <div className="bg-[#060d14] border border-emerald-500/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            <h3 className="text-white font-bold text-sm">Depósitos (BD)</h3>
            <span className="ml-auto text-[10px] text-cyan-400 font-mono">SUPABASE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            {deposits.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">Sin depósitos registrados.</p>
            ) : deposits.slice(0, 6).map((d, i) => (
              <div key={d.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${
                  i === depositIdx % Math.min(deposits.length, 6) ? 'bg-emerald-500/10 border border-emerald-500/20 scale-[1.02]' : 'bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{d.status === 'Aprobado' ? '✅' : d.status === 'Rechazado' ? '❌' : '⏳'}</span>
                  <div>
                    <p className="text-white text-sm font-bold">{(d as any).client_profile?.full_name || 'Cliente'}</p>
                    <p className="text-[10px] text-gray-500">{new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-mono font-bold text-sm">${Number(d.amount).toLocaleString()}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${d.type === 'FTD' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>{d.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-[#060d14] border border-amber-500/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-white font-bold text-sm">Alertas del Sistema</h3>
          <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded">{alerts.length}</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((a, i) => (
            <div key={i} className={`p-3 rounded-xl border text-sm transition-all hover:scale-[1.01] ${
              a.type === 'danger' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
              a.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
              'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
            }`}>
              <p className="font-semibold">{a.msg}</p>
              <p className="text-xs opacity-50 mt-1">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
