import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacidadPage() {
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
              <Lock size={24} className="text-brand" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Política de Privacidad</h1>
              <p className="text-muted text-sm mt-1">Última actualización: Mayo 2026</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-brand/50 to-transparent my-8" />

          {/* Body */}
          <div className="prose prose-invert max-w-none space-y-8 text-foreground leading-relaxed text-[15px]">

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">1</span>
                Introducción
              </h2>
              <p>
                En InvestPRO (en adelante, "nosotros", "nuestro" o "la Plataforma"), respetamos y protegemos la privacidad de
                nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos
                la información personal que usted nos proporciona al utilizar nuestros servicios.
              </p>
              <p>
                Esta política cumple con la <strong className="text-foreground">Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales
                de Colombia), el <strong className="text-foreground">Decreto 1377 de 2013</strong>, y los lineamientos del
                <strong className="text-foreground"> Reglamento General de Protección de Datos (GDPR)</strong> de la Unión Europea,
                según aplique a la jurisdicción del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">2</span>
                Datos que Recopilamos
              </h2>
              <p>Recopilamos los siguientes tipos de información:</p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.1 Datos proporcionados por el usuario</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Datos de registro:</strong> nombre completo, correo electrónico, número de teléfono, país de residencia.</li>
                <li><strong className="text-foreground">Datos de verificación (KYC):</strong> documento de identidad, comprobante de domicilio, selfie de verificación.</li>
                <li><strong className="text-foreground">Datos financieros:</strong> información de métodos de pago, historial de transacciones, direcciones de billeteras crypto.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.2 Datos recopilados automáticamente</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Datos de navegación:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas, duración de sesión.</li>
                <li><strong className="text-foreground">Cookies y tecnologías similares:</strong> utilizamos cookies esenciales, analíticas y de marketing (Google Analytics, Google Tag Manager, Hotjar).</li>
                <li><strong className="text-foreground">Datos de UTM:</strong> parámetros de campañas publicitarias para medir la efectividad de nuestro marketing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">3</span>
                Finalidad del Tratamiento
              </h2>
              <p>Utilizamos su información personal para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crear y administrar su cuenta en la Plataforma.</li>
                <li>Procesar depósitos, retiros y transacciones financieras.</li>
                <li>Cumplir con obligaciones legales de KYC/AML.</li>
                <li>Asignar un asesor personal y facilitar la comunicación con el equipo de soporte.</li>
                <li>Enviar comunicaciones comerciales, promociones y actualizaciones del servicio.</li>
                <li>Mejorar la experiencia del usuario y optimizar la plataforma.</li>
                <li>Prevenir fraudes, actividades ilícitas y proteger la seguridad del sistema.</li>
                <li>Cumplir con requerimientos legales y regulatorios.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">4</span>
                Base Legal del Tratamiento
              </h2>
              <p>El tratamiento de sus datos se fundamenta en:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Consentimiento:</strong> otorgado al registrarse en la plataforma y aceptar estos términos.</li>
                <li><strong className="text-foreground">Ejecución contractual:</strong> necesario para prestar los servicios contratados.</li>
                <li><strong className="text-foreground">Obligación legal:</strong> cumplimiento de normativas KYC/AML y fiscales.</li>
                <li><strong className="text-foreground">Interés legítimo:</strong> prevención de fraude y mejora del servicio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">5</span>
                Compartir Información con Terceros
              </h2>
              <p>
                InvestPRO <strong className="text-foreground">no vende ni alquila</strong> sus datos personales a terceros. Podemos compartir
                información con:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Proveedores de servicios:</strong> procesadores de pago (NOWPayments, Stripe), servicios de comunicación (Resend, Twilio), hosting (Supabase, Cloudflare).</li>
                <li><strong className="text-foreground">Autoridades legales:</strong> cuando sea requerido por ley o para proteger nuestros derechos.</li>
                <li><strong className="text-foreground">Socios de análisis:</strong> Google Analytics, Google Ads (datos anonimizados para optimización de campañas).</li>
              </ul>
            </section>

            {/* ── Security Box ── */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 my-8">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={20} className="text-emerald-500" />
                <h3 className="text-lg font-bold text-emerald-400">6. Seguridad de los Datos</h3>
              </div>
              <p className="text-foreground mb-3">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted text-sm">
                <li>Encriptación SSL/TLS de 256 bits en todas las comunicaciones.</li>
                <li>Encriptación AES-256 para datos en reposo.</li>
                <li>Autenticación segura con hash de contraseñas (bcrypt).</li>
                <li>Políticas de seguridad a nivel de fila (RLS) en la base de datos.</li>
                <li>Backups automáticos diarios con retención de 30 días.</li>
                <li>Monitoreo de seguridad continuo y auditorías trimestrales.</li>
              </ul>
            </div>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">7</span>
                Derechos del Usuario
              </h2>
              <p>Conforme a la Ley 1581 de 2012 y el GDPR, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Acceso:</strong> conocer qué datos personales tenemos sobre usted.</li>
                <li><strong className="text-foreground">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                <li><strong className="text-foreground">Supresión:</strong> solicitar la eliminación de sus datos (sujeto a obligaciones legales de retención).</li>
                <li><strong className="text-foreground">Oposición:</strong> oponerse al tratamiento de sus datos para fines de marketing directo.</li>
                <li><strong className="text-foreground">Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común.</li>
                <li><strong className="text-foreground">Revocación del consentimiento:</strong> retirar su consentimiento en cualquier momento.</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, envíe un correo a <strong className="text-brand">privacidad@investpro.com</strong> con
                el asunto "Ejercicio de Derechos ARCO" e incluyendo copia de su documento de identidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">8</span>
                Cookies
              </h2>
              <p>Utilizamos los siguientes tipos de cookies:</p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-surface-alt">
                      <th className="text-left p-3 text-foreground font-bold">Tipo</th>
                      <th className="text-left p-3 text-foreground font-bold">Propósito</th>
                      <th className="text-left p-3 text-foreground font-bold">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground font-medium">Esenciales</td>
                      <td className="p-3">Funcionamiento básico de la plataforma, autenticación</td>
                      <td className="p-3">Sesión</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground font-medium">Analíticas</td>
                      <td className="p-3">Google Analytics — métricas de uso anónimas</td>
                      <td className="p-3">2 años</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground font-medium">Marketing</td>
                      <td className="p-3">Google Ads, GTM — conversiones y remarketing</td>
                      <td className="p-3">90 días</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Puede configurar su navegador para rechazar cookies. Sin embargo, esto puede afectar la funcionalidad de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">9</span>
                Retención de Datos
              </h2>
              <p>
                Conservamos sus datos personales durante el tiempo necesario para cumplir con los fines descritos en esta política,
                o según lo requiera la ley. En general:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Datos de cuenta:</strong> mientras la cuenta esté activa + 5 años después del cierre.</li>
                <li><strong className="text-foreground">Datos de transacciones:</strong> 10 años (obligación fiscal y AML).</li>
                <li><strong className="text-foreground">Datos de marketing:</strong> hasta la revocación del consentimiento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-lime/10 flex items-center justify-center text-brand text-sm font-black">10</span>
                Contacto
              </h2>
              <p>
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li className="flex items-center gap-2">📧 <strong className="text-foreground">Email:</strong> privacidad@investpro.com</li>
                <li className="flex items-center gap-2">📞 <strong className="text-foreground">Teléfono:</strong> +52 55 1837 0627</li>
                <li className="flex items-center gap-2">🏢 <strong className="text-foreground">Oficial de Protección de Datos:</strong> dpo@investpro.com</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-4">
            <Link to="/legal/terminos" className="hover:text-foreground transition-colors">Términos y Condiciones</Link>
            <Link to="/legal/privacidad" className="text-brand font-bold">Política de Privacidad</Link>
          </div>
          <p>© {new Date().getFullYear()} InvestPRO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
