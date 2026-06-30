import { useState } from 'react';
import { Copy, KeyRound, Loader2, ShieldAlert, ShieldCheck, Unlock } from 'lucide-react';
import type { Profile } from '../../../../../core/supabase/database.types';
import {
  invokeStaffAuthAdmin,
  setClientBlocked,
} from '../../../../../core/supabase/services/staff.service';

interface ClientSecurityPanelProps {
  clientId: string;
  profile: Profile;
  onUpdated: () => void;
}

export function ClientSecurityPanel({ clientId, profile, onUpdated }: ClientSecurityPanelProps) {
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const blocked = profile.is_blocked === true;

  const run = async (key: string, fn: () => Promise<void>) => {
    setPending(key);
    setError(null);
    try {
      await fn();
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error en la operación');
    } finally {
      setPending(null);
    }
  };

  const copyPassword = async () => {
    if (!tempPassword) return;
    await navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
        <ShieldAlert size={16} className="text-rose-400" />
        Seguridad (solo HEAD)
      </h3>
      <p className="text-xs text-muted mb-4">
        Bloqueo operativo, acceso login y contraseña. Todas las acciones quedan en auditoría.
      </p>

      {!blocked && (
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo de bloqueo (obligatorio)"
          className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border text-sm mb-3"
        />
      )}

      {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}

      {tempPassword && (
        <div className="mb-4 p-4 rounded-lg border border-brand/30 bg-brand/10">
          <p className="text-xs font-bold text-brand mb-2">Contraseña temporal (cópiala ahora)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm text-foreground break-all">{tempPassword}</code>
            <button
              type="button"
              onClick={() => void copyPassword()}
              className="p-2 rounded-lg border border-border hover:bg-surface-inset"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && <p className="text-xs text-brand mt-1">Copiado</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!blocked ? (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              void run('block', async () => {
                await setClientBlocked(clientId, true, reason);
                const ban = await invokeStaffAuthAdmin('ban_login', clientId);
                if (!ban.success) throw new Error(ban.error ?? 'No se pudo bloquear login');
                setReason('');
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25 text-xs font-bold disabled:opacity-50"
          >
            {pending === 'block' ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
            Bloquear cuenta
          </button>
        ) : (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              void run('unblock', async () => {
                await setClientBlocked(clientId, false, 'Desbloqueo manual HEAD');
                const unban = await invokeStaffAuthAdmin('unban_login', clientId);
                if (!unban.success) throw new Error(unban.error ?? 'No se pudo desbloquear login');
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold disabled:opacity-50"
          >
            {pending === 'unblock' ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
            Desbloquear cuenta
          </button>
        )}

        <button
          type="button"
          disabled={pending !== null}
          onClick={() =>
            void run('password', async () => {
              const res = await invokeStaffAuthAdmin('reset_password', clientId);
              if (!res.success || !res.temporary_password) {
                throw new Error(res.error ?? 'No se pudo resetear contraseña');
              }
              setTempPassword(res.temporary_password);
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-inset border border-border text-xs font-bold text-foreground disabled:opacity-50"
        >
          {pending === 'password' ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          Generar nueva contraseña
        </button>

        {!blocked && (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              void run('ban', async () => {
                const res = await invokeStaffAuthAdmin('ban_login', clientId);
                if (!res.success) throw new Error(res.error ?? 'No se pudo bloquear login');
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-inset border border-border text-xs font-bold text-muted disabled:opacity-50"
          >
            {pending === 'ban' ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            Solo bloquear login
          </button>
        )}

        {blocked && (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              void run('unban', async () => {
                const res = await invokeStaffAuthAdmin('unban_login', clientId);
                if (!res.success) throw new Error(res.error ?? 'No se pudo desbloquear login');
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-inset border border-border text-xs font-bold text-muted disabled:opacity-50"
          >
            {pending === 'unban' ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
            Solo desbloquear login
          </button>
        )}
      </div>
    </div>
  );
}
