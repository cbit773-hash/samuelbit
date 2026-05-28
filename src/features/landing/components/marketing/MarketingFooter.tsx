import { Link } from 'react-router-dom';
import { BrandLogo } from '../../../../shared/components/BrandLogo';
import { PERU_COMPANY } from '../../../../shared/constants/peru-company';
import { TrustBar } from '../../../../shared/components/TrustBar';

export function MarketingFooter() {
  return (
    <footer className="bg-[#232629] border-t border-border pt-12 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-danger/30 rounded-card p-6 mb-10">
          <h4 className="text-danger font-bold mb-2 uppercase text-sm tracking-wider">
            Advertencia de riesgo alto
          </h4>
          <p className="text-muted text-sm leading-relaxed">
            Los CFDs conllevan alto riesgo de pérdida por apalancamiento. Lee la{' '}
            <Link to="/legal/riesgos" className="text-primary hover:underline font-medium">
              advertencia completa
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <BrandLogo link={false} size="sm" />
            <p className="mt-3 text-muted text-sm">Trading CFD desde Perú. Asesoría en español.</p>
            <Link to="/registro" className="bolt-btn-primary inline-block mt-4 text-sm">
              Abrir cuenta
            </Link>
          </div>
          <div>
            <h5 className="text-foreground font-bold mb-3 text-sm">Mercados</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/mercados" className="hover:text-brand">Ver instrumentos</Link></li>
              <li><a href="/#mercados" className="hover:text-brand">Crypto y Forex</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-foreground font-bold mb-3 text-sm">Soporte</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href={`tel:${PERU_COMPANY.phoneTel}`} className="hover:text-brand">{PERU_COMPANY.phoneDisplay}</a></li>
              <li><a href="mailto:soporte@investpro.com" className="hover:text-brand">soporte@investpro.com</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-foreground font-bold mb-3 text-sm">Legal</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/legal/terminos" className="hover:text-brand">Términos</Link></li>
              <li><Link to="/legal/privacidad" className="hover:text-brand">Privacidad</Link></li>
              <li><Link to="/legal/riesgos" className="hover:text-brand">Riesgos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-xs text-muted">
          <p className="mb-3">
            {PERU_COMPANY.legalName} · RUC {PERU_COMPANY.ruc} · {PERU_COMPANY.address}
          </p>
          <TrustBar compact />
          <p className="text-center mt-6">&copy; {new Date().getFullYear()} InvestPRO</p>
        </div>
      </div>
    </footer>
  );
}
