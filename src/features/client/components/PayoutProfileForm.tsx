import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ClientPayoutProfile } from '../../../core/supabase/database.types';
import { submitMyPayoutProfile } from '../../../core/supabase/services/client-payout-profile.service';
import { PERU_CLIENT_BANKS } from '../../../shared/constants/peru-company';
import { CLIENT_PATHS } from '../../../shared/routing/paths';

const CCI_RE = /^[\d-]{8,30}$/;
const HOLDER_RE = /^[\p{L}\s.'-]{3,80}$/u;

interface PayoutProfileFormProps {
  profile: ClientPayoutProfile | null;
  onSaved: () => void;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'En revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

export function PayoutProfileForm({ profile, onSaved }: PayoutProfileFormProps) {
  const [editing, setEditing] = useState(!profile);
  const [bank, setBank] = useState(profile?.bank_name ?? PERU_CLIENT_BANKS[0]);
  const [cci, setCci] = useState(profile?.bank_cci ?? '');
  const [holder, setHolder] = useState(profile?.account_holder ?? '');
  const [crypto, setCrypto] = useState(profile?.crypto_address ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.status === 'rejected') setEditing(true);
    if (profile && !editing) {
      setBank(profile.bank_name ?? PERU_CLIENT_BANKS[0]);
      setCci(profile.bank_cci ?? '');
      setHolder(profile.account_holder ?? '');
      setCrypto(profile.crypto_address ?? '');
    }
  }, [profile, editing, profile?.status]);

  const showReadOnly =
    profile &&
    ((profile.status === 'approved' && !editing) || profile.status === 'pending');

  const canEdit =
    !profile || profile.status === 'rejected' || (profile.status === 'approved' && editing);

  const submit = async () => {
    setError(null);
    setSuccess(null);
    if (!CCI_RE.test(cci.trim())) {
      setError('CCI inválido (mín. 8 caracteres).');
      return;
    }
    if (!HOLDER_RE.test(holder.trim())) {
      setError('Titular inválido (mín. 3 letras).');
      return;
    }

    setLoading(true);
    const { profile: saved, error: err } = await submitMyPayoutProfile({
      bank_name: bank,
      bank_cci: cci.trim(),
      account_holder: holder.trim(),
      crypto_address: crypto.trim() || null,
      crypto_network: 'TRC20',
    });
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    if (saved) {
      setSuccess('Datos enviados. Un oficial de compliance los revisará en 24-48h hábiles.');
      setEditing(false);
      onSaved();
    }
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-foreground">Cuenta de retiro</h3>
        {profile && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[profile.status]}`}>
            {STATUS_LABEL[profile.status]}
          </span>
        )}
      </div>

      <p className="text-xs text-muted leading-relaxed">
        El titular debe coincidir con tu DNI/KYC. CCI de terceros puede rechazarse (política AML).
      </p>

      {profile?.status === 'pending' && (
        <div className="bg-blue-500/10 border border-blue-500/25 text-blue-300 text-sm p-3 rounded-xl flex gap-2">
          <AlertCircle size={18} className="shrink-0" />
          En revisión por compliance. Puedes ver tus datos completos abajo; los retiros bancarios se
          habilitan tras la aprobación.
        </div>
      )}

      {profile?.status === 'rejected' && profile.rejection_reason && (
        <div className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm p-3 rounded-xl">
          <strong>Motivo:</strong> {profile.rejection_reason}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm p-3 rounded-xl">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      {showReadOnly && profile ? (
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-muted">Banco:</span> <span className="text-foreground">{profile.bank_name}</span>
          </p>
          <p>
            <span className="text-muted">CCI:</span>{' '}
            <span className="text-foreground font-mono">{profile.bank_cci}</span>
          </p>
          <p>
            <span className="text-muted">Titular:</span> <span className="text-foreground">{profile.account_holder}</span>
          </p>
          {profile.crypto_address && (
            <p>
              <span className="text-muted">USDT:</span>{' '}
              <span className="text-foreground font-mono text-xs break-all">{profile.crypto_address}</span>
            </p>
          )}
          {profile.status === 'approved' && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm text-brand font-semibold hover:underline"
            >
              Solicitar cambio de datos
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            disabled={!canEdit && profile?.status === 'pending'}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground disabled:opacity-60"
          >
            {PERU_CLIENT_BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            value={cci}
            onChange={(e) => setCci(e.target.value)}
            placeholder="CCI de destino *"
            disabled={profile?.status === 'pending' && !editing}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm disabled:opacity-60"
          />
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="Titular de la cuenta *"
            disabled={profile?.status === 'pending' && !editing}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground text-sm disabled:opacity-60"
          />
          <input
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            placeholder="Dirección USDT TRC20 (opcional)"
            disabled={profile?.status === 'pending' && !editing}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm disabled:opacity-60"
          />
          {canEdit && (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full bolt-btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {profile ? 'Enviar cambios a revisión' : 'Registrar y enviar a revisión'}
            </button>
          )}
        </div>
      )}

      {profile?.status === 'approved' && (
        <p className="text-xs text-muted">
          Retiros:{' '}
          <Link to={CLIENT_PATHS.accountTab('retirar')} className="text-brand hover:underline font-medium">
            Ir a Retirar
          </Link>
        </p>
      )}
    </div>
  );
}
