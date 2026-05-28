import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getRoleNavItems, getRoleDisplayLabel } from './role-navigation.config';
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
  const location = useLocation();
  if (!role) return null;

  const items = getRoleNavItems(role);
  let lastSection = '';

  return (
    <nav
      className={`group/nav shrink-0 flex-col border-r overflow-y-auto overflow-x-hidden transition-[width] duration-200 hidden md:flex ${
        collapsed ? 'w-14 hover:w-52' : 'w-52'
      } flex`}
      style={{ background: boltTheme.bgPanel, borderColor: boltTheme.border }}
      aria-label="Navegación principal"
    >
      <div className="p-3 border-b shrink-0" style={{ borderColor: boltTheme.border }}>
        <p
          className={`text-[10px] font-bold text-muted uppercase tracking-wider transition-opacity ${
            collapsed ? 'opacity-0 group-hover/nav:opacity-100' : ''
          }`}
        >
          InvestPRO
        </p>
        <p
          className={`text-xs font-bold text-foreground mt-0.5 truncate ${
            collapsed ? 'hidden group-hover/nav:block' : 'block'
          }`}
        >
          {getRoleDisplayLabel(role)}
        </p>
      </div>
      <div className="flex-1 p-2 space-y-0.5 min-h-0">
        {items.map(({ to, label, icon: Icon, section }) => {
          const showSection = !collapsed && section && section !== lastSection;
          if (section && !collapsed) lastSection = section;
          const active = isNavItemActive(location.pathname, location.search, to);
          return (
            <div key={to}>
              {showSection && (
                <p className="px-2 pt-3 pb-1 text-[9px] font-bold text-brand uppercase tracking-wider">
                  {section}
                </p>
              )}
              <Link
                to={to}
                title={label}
                className={`flex items-center gap-2 rounded-[5px] text-xs font-semibold transition-colors ${
                  collapsed
                    ? 'justify-center py-2.5 group-hover/nav:justify-start group-hover/nav:px-2'
                    : 'px-2 py-2'
                } ${
                  active
                    ? 'bg-surface-info text-brand border border-brand/20'
                    : 'text-muted hover:text-foreground hover:bg-surface-inset border border-transparent'
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
    </nav>
  );
}
