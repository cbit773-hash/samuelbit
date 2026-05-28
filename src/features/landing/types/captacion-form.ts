export type CaptacionStep = 1 | 2;

export interface CaptacionFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneLocal: string;
  dialCode: string;
  country: string;
  /** Rellenado solo al submit (generada automáticamente) */
  password: string;
  acceptedTerms: boolean;
  acceptedRisk: boolean;
}

export const INITIAL_CAPTACION_FORM: CaptacionFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneLocal: '',
  dialCode: '+51',
  country: 'Perú',
  password: '',
  acceptedTerms: false,
  acceptedRisk: false,
};

export interface CaptacionSubmitResult {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  fullName: string;
  /** Solo en memoria para pantalla post-registro; no persistir en CRM */
  generatedPassword: string;
  leadId?: string | null;
}
