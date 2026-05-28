import { UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { PERU_COMPANY } from '../../../shared/constants/peru-company';
import { LEGAL_PUBLIC_PATHS } from '../constants/legal-documents';

export function KycAmlPage() {
  return (
    <LegalPageLayout
      title="Política KYC / AML"
      icon={UserCheck}
      activePath={LEGAL_PUBLIC_PATHS.kycAml}
    >
      <section>
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-6">
          <p className="text-foreground text-sm leading-relaxed">
            Esta política establece los requisitos de identificación del cliente y prevención de lavado de activos
            aplicables en InvestPRO. Es obligatoria para operar en cuenta real y para retiros sin restricciones.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">1. Objetivo</h2>
        <p>
          Cumplir con la Ley N° 27693 y normativa de la UIF-Perú, así como estándares internacionales de debida
          diligencia, evitando el uso de la plataforma para actividades ilícitas, fraude o financiamiento del terrorismo.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">2. Niveles de verificación</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl">
            <thead className="bg-surface-inset text-left">
              <tr>
                <th className="px-4 py-2 font-bold">Nivel</th>
                <th className="px-4 py-2 font-bold">Cuándo aplica</th>
                <th className="px-4 py-2 font-bold">Requisitos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-semibold">Básico</td>
                <td className="px-4 py-3">Registro y cuenta demo</td>
                <td className="px-4 py-3">Email verificado, datos de perfil</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Estándar</td>
                <td className="px-4 py-3">Primer depósito / operación real</td>
                <td className="px-4 py-3">DNI o CE vigente, selfie, teléfono</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Reforzado</td>
                <td className="px-4 py-3">Montos elevados, PEP o alertas</td>
                <td className="px-4 py-3">Comprobante domicilio, origen de fondos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">3. Depósitos y titularidad</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Solo se aceptan transferencias desde cuentas a nombre del titular verificado en KYC.</li>
          <li>Depósitos de terceros serán rechazados o devueltos según procedimiento interno.</li>
          <li>Los vouchers bancarios deben coincidir con monto, moneda y titular declarados.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">4. Señales de alerta</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Depósitos fragmentados el mismo día desde varios bancos.</li>
          <li>Retiro inmediato tras acreditación sin actividad de trading razonable.</li>
          <li>Datos de identidad inconsistentes con comprobantes bancarios.</li>
          <li>Uso de jurisdicciones o instrumentos de alto riesgo sin justificación.</li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Ante estas situaciones, InvestPRO puede congelar fondos, solicitar documentación adicional o reportar a la
          UIF cuando la ley lo exija.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">5. Retención de registros</h2>
        <p>
          Los documentos KYC y registros de transacciones se conservan por el plazo exigido por la normativa peruana
          (mínimo sugerido: diez años desde el cierre de la relación comercial), con cifrado en tránsito y en reposo.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">6. Derechos del cliente</h2>
        <p>
          Puede solicitar actualización de datos o ejercer derechos ARCO conforme a la{' '}
          <Link to={LEGAL_PUBLIC_PATHS.privacidad} className="text-primary hover:underline">
            Política de Privacidad
          </Link>
          . La verificación KYC puede requerirse nuevamente si cambian sus datos o tras revisiones periódicas.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">7. Contacto</h2>
        <ul className="list-none space-y-2">
          <li>
            <strong className="text-foreground">Compliance:</strong> {PERU_COMPANY.emails.legal}
          </li>
          <li>
            <strong className="text-foreground">Soporte KYC:</strong> {PERU_COMPANY.emails.soporte}
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
