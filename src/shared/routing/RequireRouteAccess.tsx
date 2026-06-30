import { Navigate } from 'react-router-dom';
import { useAuthStore, type Role } from '../../features/auth/store/auth.store';
import { getRoleHome } from '../routing/paths';

const HEAD_ROUTES = ['/dashboard/head', '/dashboard/head/clientes'];

export function canAccessRoute(role: Role | null, pathname: string): boolean {
  if (!role) return false;
  if (pathname.startsWith('/dashboard/head')) {
    return role === 'HEAD' || role === 'CHIEF';
  }
  if (pathname.startsWith('/dashboard/chief')) return role === 'CHIEF' || role === 'HEAD';
  if (pathname.startsWith('/dashboard/agent')) return ['AGENT', 'TEAM_LEADER', 'FLOOR_MANAGER', 'MANAGER', 'CHIEF', 'HEAD'].includes(role);
  if (pathname.startsWith('/dashboard/trade') || pathname.startsWith('/dashboard/account')) {
    return role === 'CLIENT';
  }
  return true;
}

interface RequireRouteAccessProps {
  children: React.ReactNode;
  pathname: string;
}

export function RequireRouteAccess({ children, pathname }: RequireRouteAccessProps) {
  const role = useAuthStore((s) => s.role);

  if (!role) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!canAccessRoute(role, pathname)) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  return <>{children}</>;
}

export { HEAD_ROUTES };
