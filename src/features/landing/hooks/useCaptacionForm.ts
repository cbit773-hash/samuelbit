import { useCallback, useState } from 'react';
import { useAuthStore } from '../../auth/store/auth.store';
import {
  buildFullPhone,
  getDialOptionByCountry,
  normalizeToE164,
} from '../../../shared/utils/phone';
import { generateSecurePassword } from '../../../shared/utils/password';
import {
  INITIAL_CAPTACION_FORM,
  type CaptacionFormState,
  type CaptacionStep,
  type CaptacionSubmitResult,
} from '../types/captacion-form';

const NAME_RE = /^[\p{L}\s'-]{2,}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_LOCAL_DIGITS: Record<string, number> = {
  Colombia: 10,
  México: 10,
  Chile: 9,
  Perú: 9,
  Argentina: 10,
  España: 9,
  USA: 10,
  Otro: 8,
};

function validateStep1(form: CaptacionFormState): string | null {
  if (!NAME_RE.test(form.firstName.trim())) return 'Ingresa un nombre válido (mín. 2 letras).';
  if (!form.lastName.trim()) return 'Ingresa tu apellido después del nombre.';
  if (!NAME_RE.test(form.lastName.trim())) return 'Ingresa un apellido válido (mín. 2 letras).';
  if (!EMAIL_RE.test(form.email.trim())) return 'Correo electrónico inválido.';
  const local = form.phoneLocal.replace(/\D/g, '');
  const minDigits = MIN_LOCAL_DIGITS[form.country] ?? 8;
  if (local.length < minDigits) {
    return `Teléfono demasiado corto (mín. ${minDigits} dígitos para ${form.country}).`;
  }
  const full = buildFullPhone(form.dialCode, form.phoneLocal);
  if (!normalizeToE164(full, form.country)) {
    return 'Teléfono inválido. Ejemplo Perú: 987654321 (9 dígitos, sin +51).';
  }
  return null;
}

function validateStep2(form: CaptacionFormState): string | null {
  if (!form.acceptedTerms) return 'Debes aceptar los Términos y la Política de Privacidad.';
  if (!form.acceptedRisk) return 'Debes confirmar que comprendes el riesgo de los CFDs.';
  return null;
}

interface UseCaptacionFormOptions {
  interest?: string;
  utmNotes?: string | null;
  onSuccess: (data: CaptacionSubmitResult) => void;
}

export function useCaptacionForm({ interest = 'Desconocido', utmNotes = null, onSuccess }: UseCaptacionFormOptions) {
  const registerClient = useAuthStore((s) => s.registerClient);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState<CaptacionStep>(1);
  const [form, setForm] = useState<CaptacionFormState>(INITIAL_CAPTACION_FORM);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof CaptacionFormState>(key: K, value: CaptacionFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const patchForm = useCallback((patch: Partial<CaptacionFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  }, []);

  const setCountry = useCallback((country: string) => {
    const dial = getDialOptionByCountry(country);
    setForm((prev) => ({
      ...prev,
      country,
      dialCode: dial.dial,
    }));
    setError(null);
  }, []);

  const goToStep2 = useCallback(() => {
    const err = validateStep1(form);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  }, [form]);

  const goToStep1 = useCallback(() => {
    setError(null);
    setStep(1);
  }, []);

  const submit = useCallback(async () => {
    const err = validateStep2(form);
    if (err) {
      setError(err);
      return;
    }

    const generatedPassword = generateSecurePassword(10);
    const fullPhoneRaw = buildFullPhone(form.dialCode, form.phoneLocal);
    const phone = normalizeToE164(fullPhoneRaw, form.country) ?? fullPhoneRaw;
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    setError(null);
    try {
      const { leadId } = await registerClient({
        email: form.email.trim(),
        password: generatedPassword,
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone,
        country: form.country,
        interest,
        utmNotes,
      });
      onSuccess({
        firstName,
        lastName,
        email: form.email.trim(),
        phone,
        country: form.country,
        fullName: `${firstName} ${lastName}`,
        generatedPassword,
        leadId,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al registrar. Intenta de nuevo.';
      setError(
        msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')
          ? 'Este correo ya está registrado. Inicia sesión.'
          : msg,
      );
    }
  }, [form, interest, utmNotes, onSuccess, registerClient]);

  const maskedPhone = (() => {
    const e164 = normalizeToE164(buildFullPhone(form.dialCode, form.phoneLocal), form.country);
    if (!e164 || e164.length < 6) return buildFullPhone(form.dialCode, form.phoneLocal);
    return `${e164.slice(0, 4)} *** ${e164.slice(-4)}`;
  })();

  return {
    step,
    form,
    error,
    isLoading,
    updateField,
    patchForm,
    setCountry,
    goToStep1,
    goToStep2,
    submit,
    maskedPhone,
    canSubmitStep2: form.acceptedTerms && form.acceptedRisk && !isLoading,
  };
};
