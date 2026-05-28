import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../../../shared/components/BrandLogo';
import { darkUi } from '../../../../shared/theme/dark-ui';
import { BoltNavLink } from '../../../../shared/ui';

const NAV_LINKS = [
  { href: '/#mercados', label: 'Mercados', isRoute: false },
  { href: '/mercados', label: 'Instrumentos', isRoute: true },
  { href: '/#plataforma', label: 'Plataforma', isRoute: false },
  { href: '/#empresa', label: 'Empresa', isRoute: false },
] as const;

const navLinkClass = `${darkUi.textSecondary} hover:text-[#9fe870] text-sm font-medium transition-colors`;

export function MarketingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 w-full ${darkUi.bgPage} border-b ${darkUi.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <BrandLogo size="md" />

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((item) =>
                item.isRoute ? (
                  <BoltNavLink key={item.href} to={item.href}>
                    {item.label}
                  </BoltNavLink>
                ) : (
                  <a key={item.href} href={item.href} className={navLinkClass}>
                    {item.label}
                  </a>
                ),
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth/login"
                className={`text-sm font-semibold ${darkUi.textPrimary} hover:text-[#9fe870] transition-colors px-3 py-2`}
              >
                Iniciar sesión
              </Link>
              <Link to="/registro" className="bolt-btn-primary text-sm">
                Abrir cuenta
              </Link>
            </div>

            <button
              type="button"
              className={`md:hidden ${darkUi.textSecondary} hover:text-[#9fe870] p-2`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={`md:hidden border-t ${darkUi.border} ${darkUi.bgInset} px-4 py-4 space-y-2`}>
            {NAV_LINKS.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block py-2 ${navLinkClass}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block py-2 ${navLinkClass}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <div className={`pt-4 flex flex-col gap-2 border-t ${darkUi.border}`}>
              <Link
                to="/auth/login"
                className={`text-center text-sm font-semibold ${darkUi.textPrimary} py-2`}
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="bolt-btn-primary w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                Abrir cuenta
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16 md:h-20 shrink-0" aria-hidden />
    </>
  );
}
