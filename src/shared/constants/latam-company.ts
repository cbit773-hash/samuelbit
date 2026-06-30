/** Datos corporativos LATAM — sin referencia a país específico en UI */
export const LATAM_COMPANY = {
  legalName: 'InvestPRO',
  taxId: 'XXXXXXXXX',
  address: 'Oficina regional LATAM',
  phoneDisplay: '+00 000 000 0000',
  phoneTel: '+00000000000',
  emails: {
    legal: 'legal@investpro.com',
    soporte: 'soporte@investpro.com',
    privacidad: 'privacidad@investpro.com',
    dpo: 'dpo@investpro.com',
  },
  website: 'www.investpro.com',
} as const;

export const LATAM_BANK_ACCOUNTS = [
  {
    id: 'latam-usd-default',
    bankName: 'Banco operativo',
    currency: 'USD' as const,
    accountRef: '000-000-000000000000-00',
    holder: 'InvestPRO',
    taxId: LATAM_COMPANY.taxId,
  },
] as const;

export const LATAM_CLIENT_BANKS = [
  'Banco local A',
  'Banco local B',
  'Banco local C',
  'Otro',
] as const;
