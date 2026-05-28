import type { ReactNode } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEGAL_PUBLIC_PATHS, type LegalPublicPath } from '../constants/legal-documents';

interface LegalPageLayoutProps {
  title: string;
  icon: LucideIcon;
  activePath: LegalPublicPath;
  children: ReactNode;
}

const FOOTER_LINKS: { to: LegalPublicPath; label: string }[] = [
  { to: LEGAL_PUBLIC_PATHS.terminos, label: 'Términos y Condiciones' },
  { to: LEGAL_PUBLIC_PATHS.regulacion, label: 'Regulación Internacional' },
  { to: LEGAL_PUBLIC_PATHS.kycAml, label: 'KYC / AML' },
  { to: LEGAL_PUBLIC_PATHS.privacidad, label: 'Política de Privacidad' },
  { to: LEGAL_PUBLIC_PATHS.riesgos, label: 'Advertencia de Riesgo' },
];

export function LegalPageLayout({ title, icon: Icon, activePath, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-deep-graphite">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-black text-sm text-polar-white">
              IP
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Invest<span className="text-brand">PRO</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-surface-info flex items-center justify-center">
              <Icon size={24} className="text-brand" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight-ink">
                {title}
              </h1>
              <p className="text-muted text-sm mt-1">Última actualización: Mayo 2026</p>
            </div>
          </div>
          <div className="h-px bg-border my-8" />
          <div className="max-w-none space-y-8 text-deep-graphite leading-relaxed text-[15px]">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-pale-mist py-8 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={
                  activePath === l.to
                    ? 'text-primary font-bold'
                    : 'hover:text-midnight-ink transition-colors'
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} InvestPRO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
