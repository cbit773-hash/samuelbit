import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Loader2 } from 'lucide-react';
import { listClientProfiles } from '../../../../core/supabase/services/staff.service';
import type { Profile } from '../../../../core/supabase/database.types';

export function ClientsTab() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const rows = await listClientProfiles();
    setClients(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => void fetchClients()}
          className="px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-semibold hover:bg-surface-inset"
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 className="animate-spin mr-2" size={20} />
          Cargando clientes...
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-inset text-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-left px-4 py-3">Región</th>
                <th className="text-right px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-surface-inset/50">
                  <td className="px-4 py-3 font-semibold">{c.full_name}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {(c as Profile & { country_code?: string }).country_code ?? 'LATAM'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/head/clientes/${c.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20"
                    >
                      <User size={14} />
                      Ver 360°
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted">
                    No hay clientes que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
