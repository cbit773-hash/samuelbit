import { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Clock, Headphones, TrendingUp, 
  BarChart3, Globe2, Zap, CheckCircle, Loader2,
  ChevronDown, Lock, Star, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../core/supabase/client';
import { trackLeadConversion } from '../../../shared/utils/analytics';
import { RiskDisclaimer } from '../../../shared/components/RiskDisclaimer';

// ── UTM Tracker ──────────────────────────────────────────────
function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

// ── FAQ Data ─────────────────────────────────────────────────
const faqs = [
  { q: '¿Cuál es el depósito mínimo?', a: 'El depósito mínimo es de $250 USD. Aceptamos tarjetas, transferencias bancarias y criptomonedas.' },
  { q: '¿Cuánto tarda un retiro?', a: 'Los retiros se procesan en 24 horas hábiles. Para criptomonedas, puede ser en minutos.' },
  { q: '¿Es segura la plataforma?', a: 'Sí. Usamos encriptación SSL de 256 bits, autenticación de dos factores y tu capital está segregado en cuentas separadas.' },
  { q: '¿Necesito experiencia previa?', a: 'No. Tu asesor personal te guía paso a paso desde el primer día. Ofrecemos capacitación gratuita.' },
  { q: '¿En qué instrumentos puedo invertir?', a: 'Criptomonedas (Bitcoin, Ethereum, Solana...), Forex (EUR/USD, GBP/USD...), Acciones (Apple, Tesla...) y Materias Primas (Oro, Petróleo).' },
];

// ── Component ────────────────────────────────────────────────
export function CaptacionLanding() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: 'Colombia' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => { setUtm(getUTMParams()); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !acceptedTerms) return;
    setSending(true); setError('');

    // Split name
    const parts = form.name.trim().split(' ');
    const first_name = parts[0] || '';
    const last_name = parts.slice(1).join(' ') || '';

    // Determine interest from UTM
    let interest = 'Desconocido';
    const campaign = utm.utm_campaign || '';
    if (campaign.includes('crypto')) interest = 'Crypto';
    else if (campaign.includes('forex')) interest = 'Forex';
    else if (campaign.includes('acciones') || campaign.includes('stock')) interest = 'Acciones';

    // Build notes with UTM data
    const utmNote = Object.entries(utm).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(' | ');

    const { error: dbError } = await supabase.from('leads').insert({
      first_name,
      last_name,
      phone: form.phone,
      email: form.email || null,
      country: form.country,
      status: 'Nuevo',
      interest,
      notes: utmNote ? `[UTM] ${utmNote}` : null,
    });

    if (dbError) {
      console.error('[Landing] Error:', dbError);
      setError('Error al registrar. Intenta de nuevo.');
    } else {
      setSent(true);
      // Fire GTM dataLayer push + Google Ads conversion pixel
      trackLeadConversion({
        name: form.name,
        phone: form.phone,
        email: form.email,
        country: form.country,
        utm_source: utm.utm_source,
        utm_campaign: utm.utm_campaign,
      });
    }
    setSending(false);
  };

  // ── Success State ──
  if (sent) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-emerald-500" size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">¡Registro Exitoso!</h1>
          <p className="text-xl text-gray-400 mb-6">
            Tu asesor personal te contactará en <span className="text-emerald-400 font-bold">menos de 5 minutos</span>.
          </p>
          <p className="text-gray-500 mb-8">Revisa tu teléfono — recibirás una llamada de nuestro equipo para guiarte en la apertura de tu cuenta.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
            <p className="text-gray-400 text-sm mb-3">Mientras tanto, prepara:</p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Documento de identidad (INE, Cédula o Pasaporte)</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Método de pago (tarjeta, transferencia o crypto)</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Capital inicial mínimo: $250 USD</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Landing ──
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-sm text-black">IP</div>
            <span className="font-extrabold text-lg tracking-tight">Invest<span className="text-amber-500">PRO</span></span>
          </div>
          <a href="#registro" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            Abrir Cuenta
          </a>
        </div>
      </nav>

      {/* ═══ HERO + FORM ═══ */}
      <section className="relative pt-28 pb-20 lg:pb-32">
        {/* Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Plataforma Activa — Aceptando Registros
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Opera Crypto, Forex y Acciones desde{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">$250 USD</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-xl">
              Plataforma institucional con soporte personal en español. Tu asesor te contacta en menos de 5 minutos. Sin comisiones ocultas. Retiros en 24 horas.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: Shield, text: 'Regulado y Seguro' },
                { icon: Clock, text: 'Retiros en 24h' },
                { icon: Headphones, text: 'Soporte 24/7' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <b.icon size={16} className="text-amber-500" />
                  {b.text}
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-[#030712] flex items-center justify-center text-[10px] font-bold text-white">
                    {['FG', 'SR', 'CM', 'EV'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-gray-400 text-xs">2,500+ traders activos</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div id="registro" className="scroll-mt-24">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(245,158,11,0.08)]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-white mb-2">Abre Tu Cuenta Gratis</h2>
                <p className="text-gray-400 text-sm">Completa el formulario y tu asesor te llama en 5 minutos</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl text-center">{error}</div>
                )}
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Teléfono (WhatsApp)</label>
                  <input
                    type="tel" required value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+52 55 1234 5678"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                  <input
                    type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">País</label>
                  <select
                    value={form.country}
                    onChange={e => setForm({...form, country: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                  >
                    {['Colombia', 'México', 'Chile', 'Perú', 'Argentina', 'España', 'USA', 'Otro'].map(c => (
                      <option key={c} value={c} className="bg-[#111]">{c}</option>
                    ))}
                  </select>
                </div>

                {/* T&C Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    Acepto los{' '}
                    <Link to="/legal/terminos" target="_blank" className="text-amber-500 hover:underline font-medium">Términos y Condiciones</Link>{' '}
                    y la{' '}
                    <Link to="/legal/privacidad" target="_blank" className="text-amber-500 hover:underline font-medium">Política de Privacidad</Link>.
                    Entiendo los riesgos del trading de CFDs y criptomonedas.
                  </span>
                </label>

                <button
                  type="submit" disabled={sending || !form.name || !form.phone || !acceptedTerms}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold text-lg py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3"
                >
                  {sending ? <><Loader2 size={22} className="animate-spin" /> Registrando...</> : <>EMPEZAR A INVERTIR <ArrowRight size={22} /></>}
                </button>

                <p className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                  <Lock size={10} /> Tus datos están protegidos con encriptación SSL de 256 bits
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSTRUMENTOS ═══ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Una Cuenta, <span className="text-amber-500">Todos los Mercados</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Accede a más de 200 instrumentos financieros desde una sola plataforma. Opera 24/7 con las mejores condiciones.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '₿', title: 'Criptomonedas', desc: 'Bitcoin, Ethereum, Solana y 50+ altcoins. Opera 24/7 con apalancamiento.', items: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD'], color: 'amber' },
              { icon: '💱', title: 'Forex', desc: 'Los principales pares de divisas con spreads desde 0.1 pips y ejecución ultra-rápida.', items: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/MXN'], color: 'cyan' },
              { icon: '📈', title: 'Acciones y Más', desc: 'CFDs sobre las empresas más grandes del mundo, oro, petróleo e índices bursátiles.', items: ['Apple', 'Tesla', 'Gold', 'S&P 500'], color: 'emerald' },
            ].map((cat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all group hover:-translate-y-1">
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{cat.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <span key={item} className={`text-xs font-bold px-3 py-1.5 rounded-lg bg-${cat.color}-500/10 text-${cat.color}-400 border border-${cat.color}-500/20`}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POR QUÉ INVESTPRO ═══ */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">¿Por Qué Elegir <span className="text-amber-500">InvestPRO</span>?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Headphones, title: 'Asesor Personal', desc: 'Un experto te contacta en menos de 5 minutos para guiarte.' },
              { icon: Zap, title: 'Ejecución Instantánea', desc: 'Tus órdenes se ejecutan en milisegundos sin requotes.' },
              { icon: Shield, title: 'Capital Segregado', desc: 'Tu dinero está en cuentas separadas, 100% protegido.' },
              { icon: TrendingUp, title: 'Sin Comisiones Ocultas', desc: 'Spreads transparentes. Lo que ves es lo que pagas.' },
              { icon: Clock, title: 'Retiros en 24h', desc: 'Solicita tu retiro y recíbelo al día siguiente.' },
              { icon: Globe2, title: 'Soporte en Español', desc: 'Atención humana 24/7 en tu idioma. Sin bots.' },
              { icon: BarChart3, title: 'Herramientas Pro', desc: 'Gráficos avanzados, análisis técnico y alertas de precio.' },
              { icon: Users, title: 'Comunidad VIP', desc: 'Acceso a webinars, señales y grupo exclusivo de traders.' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-amber-500" />
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14">Empieza en <span className="text-amber-500">3 Pasos</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Regístrate', desc: 'Llena el formulario con tus datos. Toma menos de 1 minuto.' },
              { step: '02', title: 'Recibe Tu Llamada', desc: 'Tu asesor personal te contacta en 5 minutos para guiarte.' },
              { step: '03', title: 'Deposita y Opera', desc: 'Desde $250 USD. Empieza a operar el mismo día.' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-white/5 absolute -top-4 left-1/2 -translate-x-1/2">{s.step}</div>
                <div className="relative z-10 pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-amber-500 font-black text-xl">{s.step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#registro" className="inline-flex items-center gap-2 mt-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold text-lg px-10 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            ABRIR CUENTA GRATIS <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">Preguntas <span className="text-amber-500">Frecuentes</span></h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Tu Dinero No Crece en el Banco.</h2>
          <p className="text-xl text-gray-400 mb-10">Únete a miles de traders que ya están generando rendimientos con InvestPRO.</p>
          <a href="#registro" className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold text-xl px-12 py-5 rounded-full transition-all shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105">
            EMPEZAR AHORA <ArrowRight size={24} />
          </a>
          <p className="text-gray-500 text-xs mt-6">Sin compromiso. Registro gratuito. Asesoría personalizada.</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-[8px] text-black">IP</div>
              <span className="font-bold text-gray-400">InvestPRO</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/legal/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
              <Link to="/legal/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ⚠️ <strong className="text-gray-500">Advertencia de Riesgo:</strong> El trading de CFDs, Forex y criptomonedas implica un alto nivel de riesgo. 
            Puedes perder parte o la totalidad de tu inversión. Opera solo con capital que puedas permitirte perder. 
            Rendimientos pasados no garantizan resultados futuros.
          </p>
        </div>
      </footer>

      {/* ═══ RISK DISCLAIMER BANNER ═══ */}
      <RiskDisclaimer />
    </div>
  );
}
