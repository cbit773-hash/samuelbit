import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Shield, Ban, RefreshCw, CheckCircle, X, Search, Lock, Unlock, Loader2 } from 'lucide-react';
import { getAllProfiles, updateProfile } from '../../../../core/supabase/services/profiles.service';
import { getAllTeams } from '../../../../core/supabase/services/teams.service';
import type { Profile, UserRole } from '../../../../core/supabase/database.types';

const ROLE_COLORS: Record<UserRole, string> = {
  CLIENT: 'bg-gray-500/20 text-gray-400', AGENT: 'bg-cyan-500/20 text-cyan-400',
  TEAM_LEADER: 'bg-rose-500/20 text-rose-400', FLOOR_MANAGER: 'bg-purple-500/20 text-purple-400',
  MANAGER: 'bg-emerald-500/20 text-emerald-400', CHIEF: 'bg-blue-500/20 text-blue-400',
  HEAD: 'bg-amber-500/20 text-amber-400',
};
const ALL_ROLES: UserRole[] = ['CLIENT', 'AGENT', 'TEAM_LEADER', 'FLOOR_MANAGER', 'MANAGER', 'CHIEF', 'HEAD'];

export function PersonnelTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [p, t] = await Promise.all([getAllProfiles(), getAllTeams()]);
    setProfiles(p); setTeams(t);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = profiles
    .filter(e => filter === 'ALL' || e.role === filter)
    .filter(e => e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  const roleCounts = profiles.reduce((acc, e) => { acc[e.role] = (acc[e.role] || 0) + 1; return acc; }, {} as Record<string, number>);

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return '—';
    return teams.find(t => t.id === teamId)?.name || teamId.slice(0, 8);
  };

  const changeRole = async (id: string, role: UserRole) => {
    await updateProfile(id, { role });
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, role } : p));
    setEditingRole(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={32} /><span className="ml-3 text-gray-400">Cargando perfiles de Supabase...</span></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{profiles.length}</p>
          <p className="text-xs text-gray-400 font-semibold">Total Personal (BD)</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-emerald-400">{profiles.length}</p>
          <p className="text-xs text-gray-400 font-semibold">Activos</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-400">{roleCounts['AGENT'] || 0}</p>
          <p className="text-xs text-gray-400 font-semibold">Agentes</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-cyan-400">{teams.length}</p>
          <p className="text-xs text-gray-400 font-semibold">Mesas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === 'ALL' ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
          Todos ({profiles.length})
        </button>
        {Object.entries(roleCounts).map(([role, count]) => (
          <button key={role} onClick={() => setFilter(role)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === role ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
            {role.replace('_', ' ')} ({count})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={fetchData} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <RefreshCw size={16} /> Refrescar
        </button>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500/50 outline-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Mesa</th>
              <th className="px-4 py-3 text-left">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-bold text-white">{emp.full_name}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{emp.email}</td>
                <td className="px-4 py-3">
                  {editingRole === emp.id ? (
                    <select autoFocus value={emp.role} onChange={e => changeRole(emp.id, e.target.value as UserRole)} onBlur={() => setEditingRole(null)}
                      className="bg-[#111] border border-white/20 text-white rounded px-2 py-1 text-xs outline-none">
                      {ALL_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  ) : (
                    <span onClick={() => setEditingRole(emp.id)} className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${ROLE_COLORS[emp.role]}`}>{emp.role.replace('_', ' ')}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300">{getTeamName(emp.team_id)}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(emp.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No se encontraron perfiles.</p>}
      </div>
    </div>
  );
}
