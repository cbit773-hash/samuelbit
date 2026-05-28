export interface DialCodeOption {
  country: string;
  dial: string;
  flag: string;
}

/** Lista para selector de teléfono — Perú primero */
export const DIAL_CODES: DialCodeOption[] = [
  { country: 'Perú', dial: '+51', flag: '🇵🇪' },
  { country: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { country: 'México', dial: '+52', flag: '🇲🇽' },
  { country: 'Chile', dial: '+56', flag: '🇨🇱' },
  { country: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { country: 'España', dial: '+34', flag: '🇪🇸' },
  { country: 'USA', dial: '+1', flag: '🇺🇸' },
  { country: 'Otro', dial: '+1', flag: '🌐' },
];

const COUNTRY_PREFIX: Record<string, string> = {
  perú: '+51',
  peru: '+51',
  colombia: '+57',
  méxico: '+52',
  mexico: '+52',
  argentina: '+54',
  chile: '+56',
  ecuador: '+593',
  venezuela: '+58',
  españa: '+34',
  spain: '+34',
  'estados unidos': '+1',
  usa: '+1',
  brasil: '+55',
  brazil: '+55',
};

/**
 * Normaliza teléfono de lead a formato E.164 para Twilio.
 */
export function normalizeToE164(phone: string | null | undefined, country?: string | null): string | null {
  if (!phone?.trim()) return null;

  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) {
    const only = '+' + digits.slice(1).replace(/\D/g, '');
    return only.length >= 11 ? only : null;
  }

  digits = digits.replace(/\D/g, '');
  if (digits.length < 8) return null;

  const countryKey = country?.trim().toLowerCase() ?? '';
  const prefix = COUNTRY_PREFIX[countryKey];

  if (digits.startsWith('51') && digits.length >= 11) return `+${digits}`;
  if (digits.startsWith('57') && digits.length >= 12) return `+${digits}`;
  if (digits.startsWith('52') && digits.length >= 12) return `+${digits}`;

  if (prefix === '+51' && digits.length === 9 && digits.startsWith('9')) return `+51${digits}`;
  if (prefix === '+57' && digits.length === 10) return `+57${digits}`;
  if (digits.length >= 10 && prefix) {
    const local = digits.startsWith(prefix.slice(1)) ? digits.slice(prefix.length - 1) : digits;
    return `${prefix}${local.replace(/^0+/, '')}`;
  }

  if (digits.length >= 10) return `+${digits}`;
  if (prefix && digits.length >= 8) return `${prefix}${digits.replace(/^0+/, '')}`;

  return null;
}

export function getDialOptionByCountry(country: string): DialCodeOption {
  return DIAL_CODES.find((d) => d.country === country) ?? DIAL_CODES[0];
}

export function buildFullPhone(dialCode: string, phoneLocal: string): string {
  const local = phoneLocal.replace(/\D/g, '');
  const dial = dialCode.trim().startsWith('+') ? dialCode.trim() : `+${dialCode.trim()}`;
  const dialDigits = dial.replace(/\D/g, '');
  if (local.startsWith(dialDigits)) return `+${local}`;
  return `${dial}${local}`;
}

export function formatCallDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
