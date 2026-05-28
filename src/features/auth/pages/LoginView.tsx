import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/auth.store";
import type { Role } from "../../auth/store/auth.store";
import { getRoleHome } from "../../../shared/routing/paths";
import { Key, Mail } from "lucide-react";

export function LoginView() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await login(email, password);
      const role = useAuthStore.getState().role as Role | null;
      navigate(role ? getRoleHome(role) : "/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al iniciar sesión";
      setErrorMsg(
        msg.toLowerCase().includes('invalid login')
          ? 'Correo o contraseña incorrectos. Si no tienes cuenta, regístrate en /registro.'
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">InvestPRO INSTITUCIONAL</h2>
        <p className="text-muted">Inicia sesión con tu cuenta registrada</p>
      </div>

      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-alt border border-border text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-muted">Contraseña</label>
              <Link to="/auth/recuperar" className="text-xs text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-alt border border-border text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
          <p className="text-center text-sm text-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate gratis</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
