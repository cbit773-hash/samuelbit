import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getRoleHome } from '../routing/paths';

export function RouteErrorPage() {
  const error = useRouteError();
  const role = useAuthStore((s) => s.role);

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const title = is404 ? 'Página no encontrada' : 'Algo salió mal';
  const description = is404
    ? 'La ruta que buscas no existe o cambió. Usa el menú lateral o vuelve al inicio de tu panel.'
    : isRouteErrorResponse(error)
      ? error.statusText || error.data?.toString()
      : error instanceof Error
        ? error.message
        : 'Error inesperado';

  const homeTo = role ? getRoleHome(role) : '/';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-surface border border-border rounded-2xl p-8 shadow-lg">
        <AlertTriangle className="mx-auto text-amber-500 mb-4" size={40} />
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted text-sm mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homeTo}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold px-5 py-2.5 rounded-lg"
          >
            <Home size={18} />
            Ir al panel
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-alt"
          >
            Inicio público
          </Link>
        </div>
      </div>
    </div>
  );
}
