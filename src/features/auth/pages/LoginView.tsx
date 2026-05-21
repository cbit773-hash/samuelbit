import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/auth.store";
import type { Role } from "../../auth/store/auth.store";
import { User, Headset, Crown, ShieldAlert, BarChart, TrendingUp, Users, Key, Mail } from "lucide-react";

export function LoginView() {
  const navigate = useNavigate();
  const { login, loginAsDemo, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const routeByRole = (role: string) => {
    if (role === 'CLIENT') navigate('/dashboard');
    else if (role === 'AGENT') navigate('/dashboard/agent');
    else if (role === 'TEAM_LEADER' || role === 'FLOOR_MANAGER') navigate('/dashboard/floor');
    else if (role === 'CHIEF') navigate('/dashboard/chief');
    else if (role === 'MANAGER') navigate('/dashboard/manager');
    else navigate('/dashboard/head');
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await login(email, password);
      // We need to wait a tick for the role to be populated in the store by onAuthStateChange
      setTimeout(() => {
        const role = useAuthStore.getState().role;
        if (role) routeByRole(role);
        else navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      setErrorMsg(error.message || "Error al iniciar sesión");
    }
  };

  const handleDemoLogin = async (role: Role) => {
    try {
      await loginAsDemo(role);
      routeByRole(role);
    } catch (error: any) {
      console.error("Error logging in demo:", error.message);
      alert("Error al conectar con Supabase: " + error.message);
    }
  };

  const roles = [
    { id: 'HEAD' as Role, title: 'Head (Súper Admin)', desc: 'Administrador global, leads y conversión', icon: <Crown size={20} className="text-amber-500" />, color: 'amber' },
    { id: 'CHIEF' as Role, title: 'Chief', desc: 'Asistente de Head, monitoreo de depósitos y leads', icon: <BarChart size={20} className="text-blue-500" />, color: 'blue' },
    { id: 'MANAGER' as Role, title: 'Manager', desc: 'Capacitación y garantía de ventas', icon: <TrendingUp size={20} className="text-emerald-500" />, color: 'emerald' },
    { id: 'FLOOR_MANAGER' as Role, title: 'Floor Manager', desc: 'Encargado de mesas, apoyo en llamadas', icon: <ShieldAlert size={20} className="text-purple-500" />, color: 'purple' },
    { id: 'TEAM_LEADER' as Role, title: 'Team Leader', desc: 'Gestión de agentes y marcación de base', icon: <Users size={20} className="text-rose-500" />, color: 'rose' },
    { id: 'AGENT' as Role, title: 'Agente', desc: 'Mano de obra fundamental, marcación y ventas', icon: <Headset size={20} className="text-cyan-500" />, color: 'cyan' },
    { id: 'CLIENT' as Role, title: 'Cliente (Inversor)', desc: 'Acceso a la terminal de trading', icon: <User size={20} className="text-gray-400" />, color: 'gray' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white tracking-tight mb-2">InvestPRO INSTITUCIONAL</h2>
        <p className="text-gray-400">Inicia sesión en tu cuenta o accede mediante simulación</p>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl mb-8">
        <form onSubmit={handleRealLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="usuario@investpro.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-amber-600 text-background font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      <div className="w-full max-w-5xl">
        <button 
          onClick={() => setShowDemo(!showDemo)}
          className="mx-auto block text-sm text-gray-500 hover:text-white transition-colors mb-6"
        >
          {showDemo ? 'Ocultar Accesos de Simulación RBAC' : 'Mostrar Accesos de Simulación RBAC (7 Niveles)'}
        </button>

        {showDemo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {roles.map((r) => (
              <button 
                key={r.id}
                onClick={() => handleDemoLogin(r.id)}
                className="flex flex-col items-start gap-3 bg-[#0a0a0a] border border-white/10 hover:border-white/30 text-left p-5 rounded-2xl transition-all group"
              >
                <div className={`bg-${r.color}-500/10 p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                  {r.icon}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
