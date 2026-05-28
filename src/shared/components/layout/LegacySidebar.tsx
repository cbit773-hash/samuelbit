import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/auth.store";
import { CLIENT_PATHS } from "../../routing/paths";
import { LayoutDashboard, LineChart, Wallet, LogOut, PhoneCall, Crown } from "lucide-react";

export function LegacySidebar() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <span className="text-2xl font-black text-primary tracking-tighter">InvestPRO</span>
        <span className="text-[10px] font-bold bg-surface px-2 py-0.5 rounded text-foreground">{role}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {role === 'CLIENT' && (
          <>
            <Link to={CLIENT_PATHS.trade} className="flex items-center gap-3 text-muted hover:text-foreground hover:bg-surface px-4 py-2.5 rounded-xl">
              <LineChart size={18} /> <span className="font-semibold text-sm">Trading</span>
            </Link>
            <Link to={CLIENT_PATHS.accountTab('resumen')} className="flex items-center gap-3 text-muted hover:text-foreground hover:bg-surface px-4 py-2.5 rounded-xl">
              <LayoutDashboard size={18} /> <span className="font-semibold text-sm">Mi Cuenta</span>
            </Link>
            <Link to="/dashboard/wallet" className="flex items-center gap-3 text-muted hover:text-foreground hover:bg-surface px-4 py-2.5 rounded-xl">
              <Wallet size={18} /> <span className="font-semibold text-sm">Billetera</span>
            </Link>
          </>
        )}
        {role === 'AGENT' && (
          <Link to="/dashboard/agent" className="flex items-center gap-3 text-muted hover:text-foreground px-4 py-2.5 rounded-xl">
            <PhoneCall size={18} /> <span className="text-sm font-semibold">Agente</span>
          </Link>
        )}
        {role === 'HEAD' && (
          <Link to="/dashboard/head" className="flex items-center gap-3 text-muted hover:text-foreground px-4 py-2.5 rounded-xl">
            <Crown size={18} /> <span className="text-sm font-semibold">Head</span>
          </Link>
        )}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={async () => { await logout(); navigate('/auth/login'); }}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted hover:text-rose-500 font-bold"
        >
          <LogOut size={16} /> Cerrar Sesi�n
        </button>
      </div>
    </aside>
  );
}
