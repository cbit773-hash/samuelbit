import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

export function ForgotPasswordView() {
  const { requestPasswordReset, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo enviar el correo';
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al login
        </Link>

        <h1 className="text-2xl font-black text-foreground mb-2">Recuperar contraseña</h1>
        <p className="text-muted text-sm mb-6">
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl">
            Si el correo existe en nuestra base, recibirás un enlace en unos minutos. Revisa también spam.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-3 rounded-lg text-center">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-alt border border-border text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : 'Enviar enlace'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
