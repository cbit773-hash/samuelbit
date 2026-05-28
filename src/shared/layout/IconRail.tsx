import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getIconRailItems } from './role-navigation.config';
import { isNavItemActive } from './nav-utils';
import { boltTheme } from '../theme/bolt-theme';

export function IconRail() {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  if (!role) return null;

  const items = getIconRailItems(role);

  return (
    <aside
      className="w-14 shrink-0 flex flex-col items-center py-3 gap-1 border-r z-20"
      style={{ background: boltTheme.bgRail, borderColor: boltTheme.border }}
    >
      <Link
        to="/dashboard/trade"
        className="text-[10px] font-black mb-2 tracking-tighter"
        style={{ color: '#9fe870' }}
        aria-label="InvestPRO inicio"
      >
        IP
      </Link>
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          title={label}
          aria-label={label}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            isNavItemActive(location.pathname, location.search, to)
              ? 'bg-brand text-brand-ink'
              : 'text-muted hover:text-brand hover:bg-surface-inset'
          }`}
        >
          <Icon size={18} />
        </Link>
      ))}
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => logout()}
        className="w-10 h-10 flex items-center justify-center text-muted hover:text-danger rounded-lg"
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        <LogOut size={16} />
      </button>
    </aside>
  );
}
