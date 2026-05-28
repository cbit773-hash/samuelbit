import { formatUsdWithPenEquivalent, MIN_DEPOSIT_USD, FX_DISCLAIMER } from '../utils/currency-pe';
import { PERU_COMPANY } from '../constants/peru-company';

export const PERU_HERO = {
  badge: 'Empresa constituida en Perú',
  title: 'Tu capital merece más que el plazo fijo del banco',
  subtitle:
    'Opera CFDs sobre crypto, forex e índices globales (S&P 500, Nasdaq) desde una sola cuenta en USD. Asesor en español y soporte horario Lima.',
};

export const PERU_MIN_DEPOSIT_LABEL = formatUsdWithPenEquivalent(MIN_DEPOSIT_USD);

export const PERU_FAQ = [
  {
    q: '¿Cuál es el depósito mínimo?',
    a: `El depósito mínimo es de ${PERU_MIN_DEPOSIT_LABEL}. Aceptamos transferencia bancaria desde tu banco en Perú (BCP, Interbank, BBVA, etc.) y criptomonedas. Yape/Plin no están habilitados como depósito directo.`,
  },
  {
    q: '¿Cuánto tarda un retiro?',
    a: 'Los retiros bancarios se procesan en 24-48 horas hábiles (horario Perú, UTC-5). Retiros en USDT pueden ser más rápidos según la red.',
  },
  {
    q: '¿Es segura la plataforma?',
    a: 'Usamos cifrado SSL, verificación KYC y segregación operativa de fondos. InvestPRO es una SAC peruana; revisa siempre los riesgos de CFD antes de depositar.',
  },
  {
    q: '¿Puedo comprar ETFs en la BVL?',
    a: 'No ofrecemos custodia de ETFs en la Bolsa de Lima. Puedes obtener exposición a índices como S&P 500 o Nasdaq mediante CFDs, con alto riesgo y sin garantía de rentabilidad.',
  },
  {
    q: '¿En qué instrumentos puedo operar?',
    a: 'Criptomonedas (Bitcoin, Ethereum…), Forex (EUR/USD, USD/PEN…), índices (S&P 500, Nasdaq vía CFD) y materias primas según disponibilidad en tu terminal.',
  },
] as const;

export const PERU_BANK_TRIGGERS = [
  '¿Tu ahorro en el BCP o Interbank casi no rinde?',
  'Mientras el tipo de cambio se mueve, el plazo fijo sigue igual.',
  'Una cuenta, asesor en Perú y mercados globales en USD.',
] as const;

export const PERU_HERO_CTA = {
  primary: 'Abrir cuenta en Perú',
  secondary: 'Ver mercados (CFD)',
  tertiary: 'Iniciar sesión',
} as const;

export const PERU_REGISTRO_BULLETS = [
  `Depósito desde ${PERU_MIN_DEPOSIT_LABEL} — BCP, Interbank o crypto`,
  'Asesor personal te llama en menos de 5 minutos (+51)',
  'Cuenta en USD con terminal en tiempo real',
  'Registro gratuito — verificación KYC antes de operar',
] as const;

export const PERU_REGISTRO_HERO = {
  badge: 'Empresa constituida en Perú',
  title: 'Abre tu cuenta y opera mercados globales',
  interestBadge: (interest: string) => `Te interesa: ${interest}`,
  riskLink: 'Leer advertencia de riesgo CFD',
} as const;

/** Copy para layout split /registro (estilo broker institucional) */
export const PERU_REGISTRO_SPLIT = {
  tagline:
    'Opera divisas, criptomonedas, materias primas, metales, acciones e índices desde una sola cuenta.',
  formTitle: 'Regístrate aquí',
  formSubtitle: 'Completa tus datos. Tu asesor te contacta en minutos.',
  disclaimerTitle: 'Descargo de responsabilidad y aviso de riesgos',
  disclaimerBody: `Los CFDs, Forex y criptoactivos son instrumentos complejos con alto riesgo de pérdida rápida de capital debido al apalancamiento. Entre el 70% y el 85% de las cuentas de inversores minoristas pierden dinero. No son depósitos bancarios ni productos de AFP. Verifica ofertas en la SMV antes de invertir. ${PERU_COMPANY.legalName} — ${PERU_COMPANY.address}.`,
  ageFootnote: (minDeposit: string) =>
    `Para invertir en línea debes tener al menos 18 años. Inversión mínima ${minDeposit}.`,
  loginLabel: '¿Ya tienes cuenta?',
  loginCta: 'Iniciar sesión',
} as const;

export const PERU_REGISTRO_FORM = {
  step1Title: 'Tus datos',
  step2Title: 'Confirma tu cuenta',
  step1Subtitle: (minDeposit: string) => `Opera desde ${minDeposit} — tu asesor te llama al +51 en minutos`,
  step2Subtitle: 'Acepta los términos — te entregamos una contraseña segura al finalizar',
  step1Cta: 'Continuar',
  step1Footnote: 'Sin tarjeta · Registro en menos de 1 min',
  step2Cta: 'Crear mi cuenta gratis',
  step2Greeting: (name: string) => `Hola, ${name}`,
  passwordHint:
    'Al crear tu cuenta generaremos una contraseña segura y te la mostraremos en el siguiente paso para que puedas copiarla y acceder a tu panel.',
  sslNote: 'Tus datos están protegidos con encriptación SSL',
  hasAccount: '¿Ya tienes cuenta?',
  login: 'Iniciar sesión',
  back: 'Atrás',
} as const;

/** FAQ acotado para /registro (depósito, asesor, KYC) */
export const PERU_REGISTRO_FAQ = PERU_FAQ.filter((_, i) => [0, 2, 4].includes(i));

export const PERU_REGISTRO_POST = {
  title: 'Tu contraseña está lista',
  greeting: (name: string, email: string) =>
    `Hola ${name}, tu cuenta InvestPRO ya fue creada con el correo ${email}. Guarda esta contraseña en un lugar seguro.`,
  passwordLabel: 'Tu contraseña',
  antiPhishing: 'No compartas esta contraseña por chat o llamadas no verificadas. InvestPRO nunca te la pedirá por WhatsApp.',
  changePassword: 'Establecer nueva contraseña',
  newPassword: 'Nueva contraseña',
  confirmPassword: 'Confirmar contraseña',
  cancel: 'Cancelar',
  save: 'Guardar',
  copy: 'Copiar',
  copied: 'Copiado',
  continuePanel: 'Ir a mi cuenta',
  firstDeposit: 'Hacer mi primer depósito',
  checklist: [
    'Cuenta creada correctamente',
    'Copia y guarda tu contraseña',
    'Entra a tu panel para operar o depositar',
  ] as const,
} as const;

export const PERU_CTA_BAND = {
  title: 'Tu dinero no crece en el banco.',
  subtitle: 'Únete a traders en Perú que operan mercados globales con asesoría en español.',
  primary: 'Abrir cuenta gratis',
  footnote: 'Sin compromiso. Registro gratuito. Asesoría personalizada.',
} as const;

export const PERU_MARKETS = [
  {
    id: 'crypto',
    icon: 'Bitcoin' as const,
    title: 'Criptomonedas',
    desc: 'Bitcoin, Ethereum, Solana y 50+ pares. Opera 24/7 con apalancamiento.',
    items: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD'],
    utmTerm: 'crypto',
  },
  {
    id: 'forex',
    icon: 'Globe2' as const,
    title: 'Forex',
    desc: 'Pares globales y exposición al tipo de cambio USD/PEN según disponibilidad.',
    items: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/PEN'],
    utmTerm: 'forex',
  },
  {
    id: 'indices',
    icon: 'LineChart' as const,
    title: 'Índices (CFD)',
    desc: 'Exposición a S&P 500 y Nasdaq sin comprar ETF en la BVL. Alto riesgo.',
    items: ['S&P 500', 'Nasdaq', 'XAU/USD', 'BTC/USD'],
    utmTerm: 'indices',
  },
] as const;

export const PERU_STEPS = [
  { step: '01', title: 'Regístrate', desc: 'Completa el formulario. Menos de 1 minuto.' },
  { step: '02', title: 'Recibe tu llamada', desc: 'Tu asesor te contacta en minutos para guiarte.' },
  { step: '03', title: 'Deposita y opera', desc: `Desde ${PERU_MIN_DEPOSIT_LABEL}. Transferencia o crypto.` },
] as const;

export const PERU_RISK_PLAIN =
  'Entiendo que los CFDs y criptoactivos tienen alto riesgo: puedo perder todo mi capital. No es un depósito bancario ni una AFP.';

export const PERU_SMV_STRIP =
  `Los CFDs y Forex no son valores negociados en la BVL. Verifica ofertas en ${PERU_COMPANY.smvDisclaimerUrl}`;

export { FX_DISCLAIMER };
