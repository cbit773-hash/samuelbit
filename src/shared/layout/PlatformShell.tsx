import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RoleNav } from './RoleNav';
import { AccountMetricsBar } from './AccountMetricsBar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { boltTheme } from '../theme/bolt-theme';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { ClientDataProvider } from '../../features/client/context/ClientDataContext';

interface PlatformShellProps {
  fullBleed?: boolean;
  showMetricsBar?: boolean;
  children?: ReactNode;
}

export function PlatformShell({ fullBleed = false, showMetricsBar = true, children }: PlatformShellProps) {
  const role = useAuthStore((s) => s.role);
  const location = useLocation();
  const isTradeRoute =
    location.pathname === '/dashboard/trade' ||
    location.pathname.startsWith('/dashboard/trade/');

  return (
    <div
      data-theme="invest-dark"
      className="flex h-screen w-full overflow-hidden text-[#f5f6f4]"
      style={{ background: boltTheme.bgShell }}
    >
      <RoleNav collapsed={isTradeRoute} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div
          className="flex items-center gap-2 px-2 py-1.5 border-b shrink-0 md:hidden"
          style={{ background: boltTheme.bgPanel, borderColor: boltTheme.border }}
        >
          <MobileNavDrawer />
        </div>
        {showMetricsBar && <AccountMetricsBar compact={isTradeRoute} />}
        <main className={`flex-1 overflow-auto min-h-0 ${fullBleed || isTradeRoute ? '' : 'p-4 md:p-6'}`}>
          {role === 'CLIENT' ? (
            <ClientDataProvider>{children ?? <Outlet />}</ClientDataProvider>
          ) : (
            children ?? <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
