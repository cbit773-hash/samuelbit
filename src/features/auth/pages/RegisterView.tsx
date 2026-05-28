import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

const COUNTRIES = ['Colombia', 'México', 'Chile', 'Perú', 'Argentina', 'España', 'USA', 'Otro'];

export interface RegisterFormData {
  name: string;
  phone: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterViewProps {
  interest?: string;
  utmNotes?: string | null;
  onSuccess: (data: RegisterFormData) => void;
}

const inputClass =
  'w-full bg-surface-alt border border-border text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30/30 transition-all placeholder-muted-tertiary';
const labelClass = 'block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider';

export function RegisterView({ interest = 'Desconocido', utmNotes = null, onSuccess }: RegisterViewProps) {
  const registerClient = useAuthStore((s) => s.registerClient);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    phone: '',
    country: 'Colombia',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const canStep1 = form.name.trim() && form.phone.trim();
  const canStep2 =
    form.email.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return;
    if (!acceptedTerms) return;

    setError('');
    try {
      const parts = form.name.trim().split(/\s+/);
      const firstName = parts[0] || 'Usuario';
      const lastName = parts.slice(1).join(' ') || '';
      await registerClient({
        email: form.email.trim(),
        password: form.password,
        fullName: form.name.trim(),
        firstName,
        lastName,
        phone: form.phone,
        country: form.country,
        interest,
        utmNotes,
      });
      onSuccess(form);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar. Intenta de nuevo.';
      setError(
        msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')
          ? 'Este correo ya está registrado. Inicia sesión.'
          : msg
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${step >= n ? 'bg-accent-lime/500' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-muted mb-2">
        Paso {step} de 3 — {step === 1 ? 'Tus datos' : step === 2 ? 'Tu cuenta' : 'Confirmación'}
      </p>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono (WhatsApp)</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+52 55 1234 5678"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>País</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={`${inputClass} appearance-none`}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-surface-inset">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={!canStep1}
            onClick={() => setStep(2)}
            className="w-full bg-white/10 hover:bg-white/15 text-foreground font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Continuar <ArrowRight size={18} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@ejemplo.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repite tu contraseña"
              className={inputClass}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-rose-400 text-xs mt-1">Las contraseñas no coinciden</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-surface-inset flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              type="button"
              disabled={!canStep2}
              onClick={() => setStep(3)}
              className="flex-[2] bg-white/10 hover:bg-white/15 text-foreground font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="bg-surface-alt border border-border rounded-xl p-4 text-sm text-foreground space-y-1">
            <p>
              <span className="text-muted">Nombre:</span> {form.name}
            </p>
            <p>
              <span className="text-muted">Teléfono:</span> {form.phone}
            </p>
            <p>
              <span className="text-muted">Email:</span> {form.email}
            </p>
            <p>
              <span className="text-muted">País:</span> {form.country}
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border bg-surface-alt text-brand focus:ring-brand/30/30 cursor-pointer"
            />
            <span className="text-[11px] text-muted leading-relaxed group-hover:text-foreground transition-colors">
              Acepto los{' '}
              <Link to="/legal/terminos" target="_blank" className="text-brand hover:underline font-medium">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link to="/legal/privacidad" target="_blank" className="text-brand hover:underline font-medium">
                Política de Privacidad
              </Link>
              . Entiendo los riesgos del trading.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-surface-inset flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              type="submit"
              disabled={isLoading || !acceptedTerms}
              className="flex-[2] bolt-btn-primary py-3 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Creando cuenta...
                </>
              ) : (
                <>
                  CREAR CUENTA <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </>
      )}

      <p className="text-center text-[11px] text-muted flex items-center justify-center gap-1.5">
        <Lock size={10} /> Tus datos están protegidos con encriptación SSL
      </p>
      <p className="text-center text-xs text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-brand hover:underline font-medium">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
