import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getRoleNavItems, getRoleDisplayLabel } from './role-navigation.config';
import { isNavItemActive } from './nav-utils';
import { boltTheme } from '../theme/bolt-theme';

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!role) return null;

  const items = getRoleNavItems(role);
  let lastSection = '';

  return (
    <div className="lg:hidden shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-surface-inset"
        aria-label="Abrir menu de navegacion"
      >
        <Menu size={20} />
        <span className="text-xs font-bold">Menu</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/20"
            aria-label="Cerrar menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col"
            style={{ background: boltTheme.bgPanel, borderRight: `1px solid ${boltTheme.border}` }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: boltTheme.border }}
            >
              <div>
                <p className="text-[10px] font-bold text-muted uppercase">InvestPRO</p>
                <p className="text-sm font-bold text-foreground">{getRoleDisplayLabel(role)}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-foreground rounded-lg"
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
                      <p className="px-2 pt-3 pb-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                        {section}
                      </p>
                    )}
                    <Link
                      to={to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                        active
                          ? 'bg-primary-soft text-primary border border-primary/25'
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
          </nav>
        </>
      )}
    </div>
  );
}
