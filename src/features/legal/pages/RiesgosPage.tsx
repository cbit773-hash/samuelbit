import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { LEGAL_PUBLIC_PATHS } from '../constants/legal-documents';
import { PERU_COMPANY } from '../../../shared/constants/peru-company';

export function RiesgosPage() {
  return (
    <LegalPageLayout
      title="Advertencia de Riesgo de Inversión"
      icon={AlertTriangle}
      activePath={LEGAL_PUBLIC_PATHS.riesgos}
    >
      <section>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 mb-6">
          <p className="text-rose-200 font-bold text-lg mb-2">Aviso importante</p>
          <p className="text-foreground">
            Este documento forma parte integral de los{' '}
            <Link to={LEGAL_PUBLIC_PATHS.terminos} className="text-primary hover:underline font-medium">
              Términos y Condiciones
            </Link>{' '}
            de InvestPRO. Al utilizar la plataforma, usted declara haber leído y comprendido los riesgos descritos aquí.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            1
          </span>
          Naturaleza de los productos
        </h2>
        <p>
          InvestPRO ofrece acceso a instrumentos financieros derivados, incluyendo Contratos por Diferencia (CFDs) sobre
          criptomonedas, divisas (Forex), acciones, índices y materias primas. Estos productos no implican la propiedad del
          activo subyacente y pueden implicar apalancamiento.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            2
          </span>
          Riesgo de pérdida de capital
        </h2>
        <p>
          <strong className="text-foreground">
            Puede perder la totalidad o una parte significativa del capital depositado.
          </strong>{' '}
          El apalancamiento amplifica tanto las ganancias como las pérdidas. Un movimiento adverso del mercado puede generar
          pérdidas superiores al margen inicialmente depositado si no existen mecanismos de protección activos en su cuenta.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Los rendimientos pasados no garantizan resultados futuros.</li>
          <li>No existe rentabilidad asegurada en trading de CFDs ni criptoactivos.</li>
          <li>Operar con dinero destinado a gastos esenciales (vivienda, salud, deudas) es altamente desaconsejado.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            3
          </span>
          Volatilidad y criptoactivos
        </h2>
        <p>
          Las criptomonedas presentan volatilidad extrema, liquidez variable y riesgos regulatorios según su jurisdicción.
          Los precios pueden fluctuar de forma abrupta por noticias, eventos de mercado, fallos tecnológicos o cambios normativos.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            4
          </span>
          Riesgos tecnológicos y operativos
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Interrupciones de internet, latencia o fallos del dispositivo del usuario.</li>
          <li>Indisponibilidad temporal de la plataforma por mantenimiento o causas de fuerza mayor.</li>
          <li>Deslizamiento (slippage) en mercados de alta volatilidad.</li>
          <li>Margin call y cierre forzoso de posiciones cuando el margen disponible es insuficiente.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            5
          </span>
          Sin asesoramiento de inversión personalizado
        </h2>
        <p>
          La información, guiones comerciales o comunicaciones de asesores en la plataforma tienen carácter informativo y
          educativo. <strong className="text-foreground">No constituyen recomendación personalizada</strong> ni garantía de
          rentabilidad. Usted es el único responsable de sus decisiones de inversión.
        </p>
      </section>

      <section>
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-6">
          <h3 className="text-primary font-bold mb-2">Advertencia SMV (Perú)</h3>
          <p className="text-foreground text-sm leading-relaxed">
            La Superintendencia del Mercado de Valores (SMV) ha advertido que el ofrecimiento público de productos Forex y CFD
            sin la debida autorización puede constituir una infracción. Los CFDs no son valores negociados en la Bolsa de Valores de Lima.
            Verifique información de entidades en el sistema SIMV antes de invertir. Más información en{' '}
            <a
              href={PERU_COMPANY.smvDisclaimerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              gob.pe/smv
            </a>
            .
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            6
          </span>
          Estadística de cuentas minoristas
        </h2>
        <p>
          Conforme a estándares de divulgación del sector, un porcentaje elevado de cuentas de inversores minoristas
          pierde dinero al operar CFDs y productos apalancados. Evalúe si comprende el funcionamiento de estos instrumentos
          antes de depositar fondos.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            7
          </span>
          Recomendaciones al inversor
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Defina un presupuesto de riesgo y no lo exceda.</li>
          <li>Utilice órdenes de protección (stop loss) cuando estén disponibles.</li>
          <li>Diversifique y evite concentrar todo el capital en un solo activo.</li>
          <li>Capacítese antes de operar con apalancamiento elevado.</li>
          <li>Consulte asesoría financiera independiente si tiene dudas.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 text-sm font-black">
            8
          </span>
          Contacto
        </h2>
        <p>Para consultas sobre este aviso de riesgo:</p>
        <ul className="list-none space-y-2 mt-3">
          <li className="flex items-center gap-2">
            <strong className="text-foreground">Email:</strong> {PERU_COMPANY.emails.legal}
          </li>
          <li className="flex items-center gap-2">
            <strong className="text-foreground">Soporte:</strong> {PERU_COMPANY.emails.soporte}
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
