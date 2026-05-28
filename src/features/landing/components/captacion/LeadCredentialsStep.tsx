import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock, Mail, Phone, User } from 'lucide-react';

import type { CaptacionFormState } from '../../types/captacion-form';
import { PERU_RISK_PLAIN, PERU_REGISTRO_FORM } from '../../../../shared/copy/peru';
import { registroCtaClass, registroErrorClass, registroMutedClass, registroSubtleClass } from './captacion-styles';
import type { ReactNode } from 'react';

interface LeadCredentialsStepProps {
  form: CaptacionFormState;
  error: string | null;
  isLoading: boolean;
  maskedPhone: string;
  canSubmit: boolean;
  onChange: <K extends keyof CaptacionFormState>(key: K, value: CaptacionFormState[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function TermsToggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <span className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className={`block w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-[#9fe870]' : 'bg-[#d8dcd6]'
          }`}
          aria-hidden
        />
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
          aria-hidden
        />
      </span>
      <span className="text-[12px] text-[#454745] leading-relaxed group-hover:text-[#0e0f0c] transition-colors">
        {children}
      </span>
    </label>
  );
}

export function LeadCredentialsStep({
  form,
  error,
  isLoading,
  maskedPhone,
  canSubmit,
  onChange,
  onBack,
  onSubmit,
}: LeadCredentialsStepProps) {
  const copy = PERU_REGISTRO_FORM;
  const isDuplicateEmail =
    error?.toLowerCase().includes('ya est├í registrado') ||
    error?.toLowerCase().includes('already');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
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

      <p className="text-sm font-semibold text-[#0e0f0c]">{copy.step2Greeting(form.firstName)}</p>

      <div className="rounded-[10px] border border-[#e8ebe6] bg-[#f5f6f4] p-3.5 text-sm text-[#454745] space-y-2">
        <p className="flex items-center gap-2 min-w-0">
          <User size={16} className="text-[#6b6f6b] shrink-0" />
          <span className="truncate">
            {form.firstName} {form.lastName}
          </span>
        </p>
        <p className="flex items-center gap-2 min-w-0">
          <Mail size={16} className="text-[#6b6f6b] shrink-0" />
          <span className="truncate">{form.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone size={16} className="text-[#6b6f6b] shrink-0" />
          <span>{maskedPhone}</span>
        </p>
      </div>

      <p className="text-[12px] text-[#454745] leading-relaxed rounded-[10px] bg-[#ecf9f9] border border-[#d0e8e8] px-3 py-2.5">
        {copy.passwordHint}
      </p>

      <TermsToggle
        checked={form.acceptedRisk}
        onChange={(v) => onChange('acceptedRisk', v)}
      >
        {PERU_RISK_PLAIN}
      </TermsToggle>

      <TermsToggle
        checked={form.acceptedTerms}
        onChange={(v) => onChange('acceptedTerms', v)}
      >
        Estoy de acuerdo con los{' '}
        <Link
          to="/legal/terminos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#163300] font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          T├®rminos y Condiciones
        </Link>
        , la{' '}
        <Link
          to="/legal/privacidad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#163300] font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Pol├¡tica de Privacidad
        </Link>{' '}
        y el{' '}
        <Link
          to="/legal/riesgos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#163300] font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Aviso de Riesgo
        </Link>
        .
      </TermsToggle>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 min-h-[48px] border border-[#d8dcd6] text-[#0e0f0c] font-semibold rounded-[10px] hover:bg-[#f5f6f4] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <ArrowLeft size={18} /> {copy.back}
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`flex-[2] ${registroCtaClass}`}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creando...
            </>
          ) : (
            copy.step2Cta
          )}
        </button>
      </div>

      <p className={`text-center text-[11px] flex items-center justify-center gap-1.5 ${registroSubtleClass}`}>
        <Lock size={10} /> {copy.sslNote}
      </p>
      <p className={`text-center text-xs ${registroMutedClass}`}>
        {copy.hasAccount}{' '}
        <Link to="/auth/login" className="text-[#163300] font-semibold hover:underline">
          {copy.login}
        </Link>
      </p>
    </form>
  );
}
