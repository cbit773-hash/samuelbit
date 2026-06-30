import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getRoleNavItems, getRoleDisplayLabel, getRoleHome } from './role-navigation.config';
import { isNavItemActive } from './nav-utils';
import { boltTheme } from '../theme/bolt-theme';

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  if (!role) return null;

  const items = getRoleNavItems(role);
  let lastSection = '';

  return (
    <div className="md:hidden shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-surface-inset"
        aria-label="Abrir menú de navegación"
      >
        <Menu size={20} />
        <span className="text-xs font-bold">Menú</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/20"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col"
            style={{ background: boltTheme.bgRail, borderRight: `1px solid ${boltTheme.border}` }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: boltTheme.border }}
            >
              <Link
                to={getRoleHome(role)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 min-w-0"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ background: boltTheme.ctaSoft, color: boltTheme.brand }}
                >
                  IP
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-foreground truncate leading-tight">InvestPRO</p>
                  <p className="text-[10px] font-semibold text-muted truncate">
                    {getRoleDisplayLabel(role)}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-foreground rounded-lg shrink-0"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {items.map(({ to, label, icon: Icon, section }) => {
                const showSection = section && section !== lastSection;
                if (section) lastSection = section;
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
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-semibold ${
                        active
                          ? 'bg-brand text-brand-ink'
                          : 'text-muted hover:text-foreground hover:bg-surface-inset'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {label}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="p-2 border-t shrink-0" style={{ borderColor: boltTheme.border }}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-semibold text-muted hover:text-danger hover:bg-surface-inset"
              >
                <LogOut size={18} className="shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
