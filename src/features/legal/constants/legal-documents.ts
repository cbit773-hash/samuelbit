/** Rutas públicas de documentos legales — abrir en pestaña nueva desde el dashboard */
export const LEGAL_PUBLIC_PATHS = {
  terminos: '/legal/terminos',
  regulacion: '/legal/regulacion',
  kycAml: '/legal/kyc-aml',
  privacidad: '/legal/privacidad',
  riesgos: '/legal/riesgos',
} as const;

export type LegalPublicPath = (typeof LEGAL_PUBLIC_PATHS)[keyof typeof LEGAL_PUBLIC_PATHS];

export const LEGAL_DASHBOARD_PILLARS = [
  {
    title: 'Términos y Condiciones',
    path: LEGAL_PUBLIC_PATHS.terminos,
    status: 'Aceptados',
    description:
      'Acuerdos legales globales que rigen el uso de la plataforma InvestPRO, incluyendo responsabilidades del usuario y riesgos operativos.',
  },
  {
    title: 'Regulación Internacional',
    path: LEGAL_PUBLIC_PATHS.regulacion,
    status: 'Cumplimiento Total',
    description:
      'Operamos bajo normativas estrictas de jurisdicciones internacionales. Los fondos de los clientes están segregados de los fondos operativos.',
  },
  {
    title: 'KYC / AML',
    path: LEGAL_PUBLIC_PATHS.kycAml,
    status: 'Verificado (Nivel 2)',
    description:
      'Políticas de Conoce a tu Cliente (KYC) y Prevención de Lavado de Dinero (AML) requeridas para operar sin restricciones.',
  },
  {
    title: 'Protección de Datos (GDPR)',
    path: LEGAL_PUBLIC_PATHS.privacidad,
    status: 'Activo',
    description:
      'Tus datos personales están encriptados bajo AES-256. Cumplimos con los lineamientos del Reglamento General de Protección de Datos.',
  },
] as const;
