import type { Role } from '../../features/auth/store/auth.store';

/** Rutas canónicas del área cliente (única fuente de verdad) */
export const CLIENT_PATHS = {
  trade: '/dashboard/trade',
  tradingAlias: '/dashboard/trading',
  account: '/dashboard/account',
  accountTab: (tab: string) => `/dashboard/account?tab=${tab}` as const,
  wallet: '/dashboard/wallet',
  legal: '/dashboard/legal',
  advisor: '/dashboard/advisor',
} as const;

export const ROLE_HOME: Record<Role, string> = {
  CLIENT: CLIENT_PATHS.trade,
  AGENT: '/dashboard/agent',
  TEAM_LEADER: '/dashboard/team-leader',
  FLOOR_MANAGER: '/dashboard/floor',
  MANAGER: '/dashboard/manager',
  CHIEF: '/dashboard/chief',
  HEAD: '/dashboard/head',
};

export function getRoleHome(role: Role): string {
  return ROLE_HOME[role];
}

/** Enlace de notificaciones in-app según rol */
export function getNotificationInboxPath(role: Role | null): string {
  if (role === 'CLIENT') return CLIENT_PATHS.accountTab('notificaciones');
  if (role === 'CHIEF') return '/dashboard/chief';
  if (role === 'HEAD') return '/dashboard/head';
  if (role === 'AGENT') return '/dashboard/agent';
  return '/dashboard';
}
