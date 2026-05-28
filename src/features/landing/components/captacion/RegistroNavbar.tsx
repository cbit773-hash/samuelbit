import { Link } from 'react-router-dom';
import { BrandLogo } from '../../../../shared/components/BrandLogo';

export function RegistroNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-5 sm:px-8 lg:px-12 py-5 flex items-center justify-between bg-transparent">
      <BrandLogo size="lg" />
      <Link
        to="/auth/login"
        className="text-sm font-semibold text-foreground/75 hover:text-brand transition-colors"
      >
        Iniciar sesión
      </Link>
    </header>
  );
}
