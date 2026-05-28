import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { PERU_COMPANY } from '../../../shared/constants/peru-company';
import { LEGAL_PUBLIC_PATHS } from '../constants/legal-documents';

export function RegulacionPage() {
  return (
    <LegalPageLayout
      title="Marco Regulatorio Internacional"
      icon={Scale}
      activePath={LEGAL_PUBLIC_PATHS.regulacion}
    >
      <section>
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-6">
          <p className="text-foreground text-sm leading-relaxed">
            Este documento describe el marco de cumplimiento de {PERU_COMPANY.legalName} (InvestPRO) en materia
            de servicios financieros digitales, segregación de fondos y cooperación con autoridades competentes.
            Complementa los{' '}
            <Link to={LEGAL_PUBLIC_PATHS.terminos} className="text-primary hover:underline font-medium">
              Términos y Condiciones
            </Link>
            .
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">1. Naturaleza del servicio</h2>
        <p>
          InvestPRO ofrece una plataforma tecnológica de acceso a mercados globales mediante instrumentos derivados
          (CFDs) y servicios relacionados. La operación se realiza bajo contrato con el cliente y sujeta a las leyes
          aplicables en la jurisdicción del usuario y en la del prestador del servicio.
        </p>
        <p className="mt-3">
          Los CFDs no son valores cotizados en la Bolsa de Valores de Lima ni depósitos bancarios. Consulte la{' '}
          <Link to={LEGAL_PUBLIC_PATHS.riesgos} className="text-primary hover:underline">
            Advertencia de Riesgo
          </Link>{' '}
          y las advertencias de la SMV antes de invertir.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">2. Segregación de fondos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Los fondos depositados por clientes se registran en cuentas operativas identificadas y separadas de las
            cuentas corporativas de gastos y nómina de la empresa.
          </li>
          <li>
            No se utiliza el capital de clientes para financiar operaciones propias de la compañía distintas a la
            ejecución y liquidación de sus órdenes.
          </li>
          <li>
            Los retiros se procesan únicamente hacia cuentas bancarias verificadas a nombre del titular de la cuenta
            InvestPRO (política de titularidad única).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">3. Cumplimiento normativo</h2>
        <p>InvestPRO mantiene políticas alineadas con estándares internacionales en:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Prevención de lavado de activos y financiamiento del terrorismo (AML/CFT).</li>
          <li>Conoce a tu cliente (KYC) y debida diligencia reforzada cuando corresponda.</li>
          <li>Protección de datos personales (Ley 29733 Perú y principios GDPR).</li>
          <li>Transparencia comercial y divulgación de riesgos en materiales de marketing.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">4. Perú — referencias regulatorias</h2>
        <p>
          En Perú, la Superintendencia del Mercado de Valores (SMV) ha emitido advertencias sobre el ofrecimiento
          público de productos Forex y CFD sin la debida autorización. InvestPRO informa a sus usuarios peruanos sobre
          estos riesgos y recomienda verificar entidades en el sistema SIMV (
          <a
            href={PERU_COMPANY.simvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            smv.gob.pe
          </a>
          ).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">5. Cooperación con autoridades</h2>
        <p>
          La empresa colaborará con requerimientos legítimos de autoridades de supervisión, fiscalización o fuerza
          pública cuando exista obligación legal, respetando los derechos del titular de datos y el debido proceso.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">6. Contacto compliance</h2>
        <ul className="list-none space-y-2">
          <li>
            <strong className="text-foreground">Email legal:</strong> {PERU_COMPANY.emails.legal}
          </li>
          <li>
            <strong className="text-foreground">Razón social:</strong> {PERU_COMPANY.legalName} — RUC {PERU_COMPANY.ruc}
          </li>
          <li>
            <strong className="text-foreground">Domicilio:</strong> {PERU_COMPANY.address}
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
