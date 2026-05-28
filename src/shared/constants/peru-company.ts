/** Datos corporativos Perú — reemplazar placeholders antes de campañas masivas */
export const PERU_COMPANY = {
  legalName: 'InvestPRO SAC',
  ruc: '20XXXXXXXXX',
  address: 'Av. [Dirección], Lima, Perú',
  phoneDisplay: '+51 1 000 0000',
  phoneTel: '+51010000000',
  emails: {
    legal: 'legal@investpro.com',
    soporte: 'soporte@investpro.com',
    privacidad: 'privacidad@investpro.com',
    dpo: 'dpo@investpro.com',
  },
  website: 'www.investpro.com',
  smvDisclaimerUrl: 'https://www.gob.pe/institucion/smv/noticias/1121376-advertencia-sobre-el-ofrecimiento-publico-de-productos-y-servicios-forex-y-de-contratos-por-diferencia-cfd',
  simvUrl: 'https://www.smv.gob.pe',
} as const;

/** Cuentas bancarias empresa — configurar en producción */
export const PERU_BANK_ACCOUNTS = [
  {
    id: 'bcp-pen',
    bankName: 'BCP',
    currency: 'PEN' as const,
    cci: '002-000-00XXXXXXXXXX-00',
    holder: 'InvestPRO SAC',
    ruc: PERU_COMPANY.ruc,
  },
  {
    id: 'interbank-usd',
    bankName: 'Interbank',
    currency: 'USD' as const,
    cci: '003-000-00XXXXXXXXXX-00',
    holder: 'InvestPRO SAC',
    ruc: PERU_COMPANY.ruc,
  },
] as const;

export const PERU_CLIENT_BANKS = ['BCP', 'Interbank', 'BBVA', 'Scotiabank', 'BanBif', 'Otro'] as const;
