import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User } from 'lucide-react';

import type { CaptacionFormState } from '../../types/captacion-form';
import { PhoneCountryField } from './PhoneCountryField';
import {
  registroCtaClass,
  registroErrorClass,
  registroInputWithIconClass,
  registroLabelClass,
  registroSubtleClass,
} from './captacion-styles';
import { PERU_REGISTRO_FORM } from '../../../../shared/copy/peru';

interface LeadIdentityStepProps {
  form: CaptacionFormState;
  error: string | null;
  onChange: <K extends keyof CaptacionFormState>(key: K, value: CaptacionFormState[K]) => void;
  onPatch: (patch: Partial<CaptacionFormState>) => void;
  onCountryChange: (country: string) => void;
  onContinue: () => void;
}

function FieldWithIcon({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={registroLabelClass}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6f6b] pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function splitFullName(value: string): { first: string; last: string } {
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function LeadIdentityStep({
  form,
  error,
  onChange,
  onPatch,
  onCountryChange,
  onContinue,
}: LeadIdentityStepProps) {
  const copy = PERU_REGISTRO_FORM;
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();

  const isDuplicateEmail =
    error?.toLowerCase().includes('ya está registrado') ||
    error?.toLowerCase().includes('already');

  const handleFullNameChange = (value: string) => {
    const { first, last } = splitFullName(value);
    onPatch({ firstName: first, lastName: last });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className={registroErrorClass}>
          <p>{error}</p>
          {isDuplicateEmail && (
            <Link
              to="/auth/login"
              className="inline-block mt-2 text-[#163300] font-semibold hover:underline"
            >
              {copy.login}
            </Link>
          )}
        </div>
      )}

      <FieldWithIcon id="captacion-full-name" label="Nombre completo" icon={<User size={18} />}>
        <input
          id="captacion-full-name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => handleFullNameChange(e.target.value)}
          placeholder="Juan Pérez"
          className={registroInputWithIconClass}
        />
      </FieldWithIcon>

      <FieldWithIcon
        id="captacion-email"
        label="Correo electrónico"
        icon={<Mail size={18} />}
      >
        <input
          id="captacion-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="correo@ejemplo.com"
          className={registroInputWithIconClass}
        />
      </FieldWithIcon>

      <PhoneCountryField
        country={form.country}
        phoneLocal={form.phoneLocal}
        onCountryChange={onCountryChange}
        onPhoneChange={(v) => onChange('phoneLocal', v)}
        error={error}
      />

      <button type="button" onClick={onContinue} className={registroCtaClass}>
        {copy.step1Cta}
      </button>
      <p className={`text-center text-[11px] ${registroSubtleClass}`}>{copy.step1Footnote}</p>
    </div>
  );
}
