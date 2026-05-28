import { Link } from 'react-router-dom';
import { PERU_COMPANY } from '../../../shared/constants/peru-company';

export function Footer() {
  return (
    <footer className="bg-surface-alt pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 mb-12">
          <h4 className="text-danger font-bold mb-2 uppercase text-sm tracking-wider">
            Advertencia de Riesgo Alto
          </h4>
          <p className="text-muted text-sm leading-relaxed">
            Los CFDs son instrumentos complejos y conllevan un alto riesgo de perder dinero rapidamente debido al
            apalancamiento. Opere solo con capital que pueda permitirse perder.{' '}
            <Link to="/legal/riesgos" className="text-brand hover:underline font-medium">
              Leer advertencia de riesgo
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <span className="text-2xl font-black text-brand tracking-tighter">InvestPRO</span>
            <p className="mt-4 text-muted text-sm">
              Plataforma de trading CFD para mercados globales. {PERU_COMPANY.legalName}.
            </p>
          </div>

          <div>
            <h5 className="text-foreground font-bold mb-4">Mercados</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a href="/mercados" className="hover:text-brand">
                  Forex
                </a>
              </li>
              <li>
                <a href="/mercados" className="hover:text-brand">
                  Cripto
                </a>
              </li>
              <li>
                <a href="/mercados" className="hover:text-brand">
                  Indices
                </a>
              </li>
              <li>
                <a href="/mercados" className="hover:text-brand">
                  Materias primas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-foreground font-bold mb-4">Soporte</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/auth/login" className="hover:text-brand">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <a href={`tel:${PERU_COMPANY.phoneTel}`} className="hover:text-brand">
                  {PERU_COMPANY.phoneDisplay}
                </a>
              </li>
              <li>
                <a href="mailto:soporte@investpro.com" className="hover:text-brand">
                  soporte@investpro.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-foreground font-bold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/legal/terminos" className="hover:text-brand">
                  Terminos
                </Link>
              </li>
              <li>
                <Link to="/legal/privacidad" className="hover:text-brand">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/legal/riesgos" className="hover:text-brand">
                  Riesgos CFD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-xs text-muted text-center">
          <p>
            &copy; {new Date().getFullYear()} {PERU_COMPANY.legalName}. RUC {PERU_COMPANY.ruc}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
