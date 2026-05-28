import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center font-black text-sm text-black">IP</div>
            <span className="font-extrabold text-lg tracking-tight">Invest<span className="text-brand">PRO</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-accent-lime/10 flex items-center justify-center">
              <FileText size={24} className="text-brand" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Términos y Condiciones</h1>
              <p className="text-muted text-sm mt-1">Última actualización: Mayo 2026</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-brand/50 to-transparent my-8" />

          {/* Body */}
          <div className="prose prose-invert max-w-none space-y-8 text-foreground leading-relaxed text-[15px]">

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">1</span>
                Aceptación de los Términos
              </h2>
              <p>
                Al acceder, registrarse o utilizar la plataforma InvestPRO (en adelante, "la Plataforma"), usted acepta de manera irrevocable
                estos Términos y Condiciones (en adelante, "T&C") en su totalidad. Si no está de acuerdo con alguno de estos términos,
                le solicitamos que no utilice nuestros servicios.
              </p>
              <p>
                InvestPRO se reserva el derecho de modificar estos T&C en cualquier momento. Las modificaciones serán notificadas a los
                usuarios registrados por correo electrónico y/o aviso en la plataforma. El uso continuado de los servicios tras la publicación
                de cambios constituye aceptación de los mismos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">2</span>
                Descripción del Servicio
              </h2>
              <p>
                InvestPRO es una plataforma tecnológica que proporciona acceso a instrumentos financieros derivados, incluyendo pero no
                limitado a: Contratos por Diferencia (CFDs) sobre criptomonedas, pares de divisas (Forex), acciones, índices bursátiles
                y materias primas.
              </p>
              <p>
                La Plataforma actúa como proveedor de servicios tecnológicos y acceso a liquidez. <strong className="text-foreground">InvestPRO no ofrece
                asesoramiento de inversión directo.</strong> Cualquier orientación proporcionada por los asesores asignados tiene
                carácter informativo y educativo, nunca constituye una recomendación personalizada de inversión.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">3</span>
                Elegibilidad y Registro
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Debe ser mayor de 18 años (o la mayoría de edad legal en su jurisdicción).</li>
                <li>Debe proporcionar información veraz, completa y actualizada durante el registro.</li>
                <li>Es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
                <li>No puede crear múltiples cuentas sin autorización previa.</li>
                <li>InvestPRO se reserva el derecho de rechazar registros a su exclusiva discreción.</li>
              </ul>
            </section>

            {/* ── Risk Warning Box ── */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 my-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={20} className="text-rose-500" />
                <h3 className="text-lg font-bold text-rose-400">4. Advertencia de Riesgo</h3>
              </div>
              <p className="text-foreground mb-3">
                <strong className="text-foreground">Los CFDs son instrumentos complejos y conllevan un alto riesgo de perder dinero rápidamente
                debido al apalancamiento.</strong> Un porcentaje significativo de cuentas de inversores minoristas pierden dinero al operar
                CFDs. Usted debe considerar si comprende cómo funcionan los CFDs y si puede permitirse asumir el alto riesgo de perder su dinero.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted text-sm">
                <li>Los rendimientos pasados no garantizan resultados futuros.</li>
                <li>El valor de las inversiones puede tanto subir como bajar.</li>
                <li>El apalancamiento puede amplificar tanto las ganancias como las pérdidas.</li>
                <li>Nunca invierta dinero que no pueda permitirse perder.</li>
                <li>Las criptomonedas son altamente volátiles y no están reguladas en todas las jurisdicciones.</li>
              </ul>
            </div>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">5</span>
                Depósitos y Retiros
              </h2>
              <p>
                <strong className="text-foreground">Depósitos:</strong> Los depósitos se procesarán a través de los métodos de pago disponibles
                en la plataforma (transferencia bancaria, criptomonedas u otros métodos habilitados). El depósito mínimo es de $250 USD
                o su equivalente en la moneda local.
              </p>
              <p>
                <strong className="text-foreground">Retiros:</strong> Las solicitudes de retiro serán procesadas dentro de las 24 horas hábiles
                siguientes a la solicitud. InvestPRO podrá solicitar documentación adicional para verificar la identidad del solicitante
                antes de procesar un retiro, conforme a las políticas KYC/AML vigentes.
              </p>
              <p>
                <strong className="text-foreground">Comisiones:</strong> Cada método de pago puede tener comisiones asociadas que serán
                claramente informadas antes de confirmar la transacción. InvestPRO no cobra comisiones ocultas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">6</span>
                KYC y Prevención de Lavado de Dinero (AML)
              </h2>
              <p>
                InvestPRO implementa políticas de Conoce a tu Cliente (KYC) y Prevención de Lavado de Dinero (AML) conforme a los
                estándares internacionales. Al registrarse, usted acepta:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar documentos de identidad válidos cuando sean solicitados.</li>
                <li>Verificar su dirección de residencia mediante comprobante.</li>
                <li>Que InvestPRO puede suspender su cuenta si no cumple con los requisitos de verificación.</li>
                <li>Que las transacciones sospechosas serán reportadas a las autoridades competentes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">7</span>
                Propiedad Intelectual
              </h2>
              <p>
                Todo el contenido de la Plataforma, incluyendo pero no limitado a: diseño, software, textos, gráficos, logotipos, íconos,
                algoritmos de trading y bases de datos, son propiedad exclusiva de InvestPRO o sus licenciantes, y están protegidos por
                las leyes de propiedad intelectual aplicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">8</span>
                Limitación de Responsabilidad
              </h2>
              <p>
                InvestPRO no será responsable por pérdidas directas, indirectas, incidentales o consecuenciales derivadas del uso de
                la Plataforma, incluyendo pero no limitado a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pérdidas derivadas de operaciones de trading.</li>
                <li>Interrupciones del servicio por causas de fuerza mayor o fallos técnicos.</li>
                <li>Errores en la ejecución de órdenes causados por conectividad del usuario.</li>
                <li>Acceso no autorizado a la cuenta del usuario por negligencia en la custodia de credenciales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">9</span>
                Cancelación y Cierre de Cuenta
              </h2>
              <p>
                El usuario puede solicitar el cierre de su cuenta en cualquier momento contactando a soporte@investpro.com.
                Antes del cierre, deberá retirar cualquier saldo disponible. InvestPRO se reserva el derecho de cerrar cuentas
                que infrinjan estos T&C, presenten actividad sospechosa o incumplan las políticas KYC/AML.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">10</span>
                Ley Aplicable y Jurisdicción
              </h2>
              <p>
                Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes vigentes de la República de Colombia.
                Cualquier controversia será sometida a los tribunales competentes de la ciudad de Bogotá, D.C., Colombia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">11</span>
                Contacto
              </h2>
              <p>
                Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li className="flex items-center gap-2">📧 <strong className="text-foreground">Email:</strong> legal@investpro.com</li>
                <li className="flex items-center gap-2">📞 <strong className="text-foreground">Teléfono:</strong> +52 55 1837 0627</li>
                <li className="flex items-center gap-2">🌐 <strong className="text-foreground">Sitio web:</strong> www.investpro.com</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-4">
            <Link to="/legal/terminos" className="text-brand font-bold">Términos y Condiciones</Link>
            <Link to="/legal/privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
          </div>
          <p>© {new Date().getFullYear()} InvestPRO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
