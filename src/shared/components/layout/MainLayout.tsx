import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/auth.store";
import type { Role } from "../../../features/auth/store/auth.store";
import { LayoutDashboard, LineChart, Wallet, BookOpen, Users, LogOut, PhoneCall, ListChecks, Target, Crown, ShieldAlert, Headphones, HeartHandshake, TrendingUp, BarChart3, ArrowUpCircle, Shield, Bell } from "lucide-react";

// ─── Mapa de home por rol ────────────────────────────────────────────────────
const ROLE_HOME: Record<Role, string> = {
  CLIENT:        '/dashboard/client',
  AGENT:         '/dashboard/agent',
  TEAM_LEADER:   '/dashboard/team-leader',
  FLOOR_MANAGER: '/dashboard/floor',
  MANAGER:       '/dashboard/manager',
  CHIEF:         '/dashboard/chief',
  HEAD:          '/dashboard/head',
};

// ─── Redirige al home correcto según rol ────────────────────────────────────
export function RoleRedirect() {
  const role = useAuthStore((state) => state.role);
  if (!role) return <Navigate to="/auth/login" replace />;
  return <Navigate to={ROLE_HOME[role]} replace />;
}

// ─── Sidebar dinámico ────────────────────────────────────────────────────────
export function Sidebar() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <span className="text-2xl font-black text-primary tracking-tighter">InvestPRO</span>
        <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-300">{role}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {/* ── CLIENTE ─────────────────────────────────────────── */}
        {role === 'CLIENT' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Mi Cuenta</p></div>
            <Link to="/dashboard/client?tab=resumen" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <LayoutDashboard size={18} className="text-blue-500" /> <span className="font-semibold text-sm">Resumen</span>
            </Link>
            <Link to="/dashboard/client?tab=depositar" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ArrowUpCircle size={18} /> <span className="font-semibold text-sm">Depositar</span>
            </Link>
            <Link to="/dashboard/trading" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <LineChart size={18} /> <span className="font-semibold text-sm">Terminal de Trading</span>
            </Link>
            <Link to="/dashboard/wallet" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Wallet size={18} /> <span className="font-semibold text-sm">Billetera Web3</span>
            </Link>
            <Link to="/dashboard/client?tab=historial" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <BarChart3 size={18} /> <span className="font-semibold text-sm">Historial</span>
            </Link>
            <Link to="/dashboard/legal" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <BookOpen size={18} /> <span className="font-semibold text-sm">InvestPRO Legal</span>
            </Link>
          </>
        )}

        {/* ── AGENTE ──────────────────────────────────────────── */}
        {role === 'AGENT' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Estación de Ventas</p></div>
            <Link to="/dashboard/agent?tab=dialer" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <PhoneCall size={18} /> <span className="font-semibold text-sm">Auto-Dialer</span>
            </Link>
            <Link to="/dashboard/agent?tab=ventas" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Target size={18} /> <span className="font-semibold text-sm">Mis Ventas (FTD)</span>
            </Link>
          </>
        )}

        {/* ── TEAM LEADER ────────────────────────────────────── */}
        {role === 'TEAM_LEADER' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-rose-500 uppercase tracking-wider">Líder de Mesa</p></div>
            <Link to="/dashboard/team-leader?tab=monitor" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Users size={18} /> <span className="font-semibold text-sm">Estado de Mesa</span>
            </Link>
            <Link to="/dashboard/team-leader?tab=leads" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ListChecks size={18} /> <span className="font-semibold text-sm">Leads de Mesa</span>
            </Link>
            <Link to="/dashboard/team-leader" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Headphones size={18} /> <span className="font-semibold text-sm">Escucha de Llamadas</span>
            </Link>
          </>
        )}

        {/* ── FLOOR MANAGER ──────────────────────────────────── */}
        {role === 'FLOOR_MANAGER' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-amber-500 uppercase tracking-wider">Comandante de Piso</p></div>
            <Link to="/dashboard/floor?tab=monitor" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Users size={18} /> <span className="font-semibold text-sm">Monitor In-Live</span>
            </Link>
            <Link to="/dashboard/floor?tab=reasignacion" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ListChecks size={18} /> <span className="font-semibold text-sm">Reasignación Leads</span>
            </Link>
          </>
        )}

        {/* ── MANAGER ─────────────────────────────────────────── */}
        {role === 'MANAGER' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Dirección de Ventas</p></div>
            <Link to="/dashboard/manager" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Target size={18} /> <span className="font-semibold text-sm">Metas y Capacitación</span>
            </Link>
          </>
        )}

        {/* ── CHIEF ───────────────────────────────────────────── */}
        {role === 'CHIEF' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Dirección Ejecutiva</p></div>
            <Link to="/dashboard/chief" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ListChecks size={18} /> <span className="font-semibold text-sm">Depósitos y Leads</span>
            </Link>
          </>
        )}

        {/* ── HEAD ────────────────────────────────────────────── */}
        {role === 'HEAD' && (
          <>
            <div className="pt-2 pb-1"><p className="px-4 text-[10px] font-bold text-amber-500 uppercase tracking-wider">Alta Dirección</p></div>
            <Link to="/dashboard/head?tab=overview" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Crown size={18} /> <span className="font-semibold text-sm">Centro de Comando</span>
            </Link>
            <Link to="/dashboard/head?tab=personnel" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Users size={18} /> <span className="font-semibold text-sm">Gestión de Personal</span>
            </Link>
            <Link to="/dashboard/head?tab=leads" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ListChecks size={18} /> <span className="font-semibold text-sm">CRM & Leads</span>
            </Link>
            <Link to="/dashboard/head?tab=deposits" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <LineChart size={18} /> <span className="font-semibold text-sm">Auditoría Depósitos</span>
            </Link>
            <Link to="/dashboard/head?tab=performance" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <Target size={18} /> <span className="font-semibold text-sm">Rendimiento Mesas</span>
            </Link>
            <Link to="/dashboard/head?tab=fraud" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors">
              <ShieldAlert size={18} /> <span className="font-semibold text-sm">Anti-Fraude</span>
            </Link>
          </>
        )}

      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 px-4 py-3 transition-colors rounded-lg font-bold">
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

// ─── Layout principal ────────────────────────────────────────────────────────
export function MainLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Conectando con InvestPRO...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
