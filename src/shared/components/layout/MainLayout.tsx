import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/auth.store';
import { NotificationToast } from '../NotificationToast';
import { PlatformShell } from '../../layout/PlatformShell';
import { getRoleHome } from '../../routing/paths';

export function RoleRedirect() {
  const role = useAuthStore((state) => state.role);
  if (!role) return <Navigate to="/auth/login" replace />;
  return <Navigate to={getRoleHome(role)} replace />;
}

export function MainLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted text-sm">Conectando con InvestPRO...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <PlatformShell>
        <Outlet />
      </PlatformShell>
      <NotificationToast />
    </>
  );
}
