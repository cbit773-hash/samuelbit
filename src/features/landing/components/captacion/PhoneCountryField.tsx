import { DIAL_CODES } from '../../../../shared/utils/phone';
import { registroLabelClass, registroSubtleClass } from './captacion-styles';

interface PhoneCountryFieldProps {
  country: string;
  phoneLocal: string;
  onCountryChange: (country: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string | null;
}

function sanitizeLocalPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 15);
}

export function PhoneCountryField({
  country,
  phoneLocal,
  onCountryChange,
  onPhoneChange,
  error,
}: PhoneCountryFieldProps) {
  const selected = DIAL_CODES.find((d) => d.country === country) ?? DIAL_CODES[0];
  const phoneError =
    error &&
    (error.toLowerCase().includes('telefono') ||
      error.toLowerCase().includes('teléfono') ||
      error.toLowerCase().includes('phone'))
      ? error
      : null;

  return (
    <div>
      <label htmlFor="captacion-phone" className={registroLabelClass}>
        Número de teléfono
      </label>
      <div
        className={`flex min-h-[48px] rounded-[10px] border bg-white overflow-hidden transition-all ${
          phoneError
            ? 'border-rose-400 ring-2 ring-rose-100'
            : 'border-[#c5cac4] focus-within:border-[#163300] focus-within:ring-2 focus-within:ring-[#9fe870]/40'
        }`}
      >
        <select
          id="captacion-country-dial"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          aria-label="País y código telefónico"
          className="shrink-0 w-[100px] bg-[#f5f6f4] border-0 border-r border-[#d8dcd6] text-[#0e0f0c] text-sm font-medium px-2 py-3 focus:outline-none cursor-pointer"
        >
          {DIAL_CODES.map((d) => (
            <option key={d.country} value={d.country}>
              {d.flag ? `${d.flag} ` : ''}
              {d.dial}
            </option>
          ))}
        </select>
        <input
          id="captacion-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          autoCorrect="off"
          spellCheck={false}
          required
          value={phoneLocal}
          onChange={(e) => onPhoneChange(sanitizeLocalPhone(e.target.value))}
          onPaste={(e) => {
            e.preventDefault();
            onPhoneChange(sanitizeLocalPhone(e.clipboardData.getData('text')));
          }}
          placeholder="987654321"
          aria-invalid={!!phoneError}
          className="flex-1 min-w-0 bg-transparent border-0 text-[#0e0f0c] px-3 py-3 text-[15px] focus:outline-none placeholder:text-[#6b6f6b]"
        />
      </div>
      <p className={`text-[10px] mt-1 ${registroSubtleClass}`}>
        {selected.country} — sin {selected.dial}
      </p>
      {phoneError && (
        <p role="alert" className="text-rose-600 text-xs mt-1">
          {phoneError}
        </p>
      )}
    </div>
  );
}
