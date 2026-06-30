import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getRoleNavItems, getRoleDisplayLabel, getRoleHome } from './role-navigation.config';
import { isNavItemActive } from './nav-utils';
import { boltTheme } from '../theme/bolt-theme';
import { useNotificationRealtime } from '../../features/trading/hooks/useNotificationRealtime';

function NotificationBadge() {
  const { unreadCount } = useNotificationRealtime();
  if (!unreadCount) return null;
  return (
    <span className="ml-auto bg-rose-500 text-polar-white text-[9px] font-black px-1.5 rounded-full">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}

interface RoleNavProps {
  collapsed?: boolean;
}

export function RoleNav({ collapsed = false }: RoleNavProps) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();
  if (!role) return null;

  const items = getRoleNavItems(role);
  let lastSection = '';

  return (
    <nav
      className={`group/nav shrink-0 flex-col border-r overflow-hidden transition-[width] duration-200 hidden md:flex ${
        collapsed ? 'w-[60px] hover:w-56' : 'w-56'
      } flex`}
      style={{ background: boltTheme.bgRail, borderColor: boltTheme.border }}
      aria-label="Navegación principal"
    >
      <div className="p-3 border-b shrink-0" style={{ borderColor: boltTheme.border }}>
        <Link
          to={getRoleHome(role)}
          className="flex items-center gap-2.5 min-w-0"
          aria-label="InvestPRO inicio"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
            style={{ background: boltTheme.ctaSoft, color: boltTheme.brand }}
          >
            IP
          </span>
          <div
            className={`min-w-0 overflow-hidden ${
              collapsed ? 'hidden group-hover/nav:block' : 'block'
            }`}
          >
            <p className="text-sm font-black text-foreground truncate leading-tight">InvestPRO</p>
            <p className="text-[10px] font-semibold text-muted truncate">{getRoleDisplayLabel(role)}</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 p-2 space-y-0.5 min-h-0 overflow-y-auto overflow-x-hidden">
        {items.map(({ to, label, icon: Icon, section }) => {
          const showSection = !collapsed && section && section !== lastSection;
          if (section && !collapsed) lastSection = section;
          const active = isNavItemActive(location.pathname, location.search, to);
          return (
            <div key={to}>
              {showSection && (
                <p className="px-2.5 pt-3 pb-1 text-[9px] font-bold text-brand uppercase tracking-wider">
                  {section}
                </p>
              )}
              <Link
                to={to}
                title={label}
                className={`flex items-center gap-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  collapsed
                    ? 'justify-center py-2.5 group-hover/nav:justify-start group-hover/nav:px-2.5'
                    : 'px-2.5 py-2'
                } ${
                  active
                    ? 'bg-brand text-brand-ink'
                    : 'text-muted hover:text-foreground hover:bg-surface-inset'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className={collapsed ? 'hidden group-hover/nav:inline truncate' : 'truncate'}>
                  {label}
                </span>
                {label === 'Alertas' && !collapsed && <NotificationBadge />}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="p-2 border-t shrink-0" style={{ borderColor: boltTheme.border }}>
        <button
          type="button"
          onClick={() => logout()}
          className={`w-full flex items-center gap-2.5 rounded-lg text-xs font-semibold text-muted hover:text-danger hover:bg-surface-inset transition-colors ${
            collapsed
              ? 'justify-center py-2.5 group-hover/nav:justify-start group-hover/nav:px-2.5'
              : 'px-2.5 py-2'
          }`}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} className="shrink-0" />
          <span className={collapsed ? 'hidden group-hover/nav:inline' : ''}>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
