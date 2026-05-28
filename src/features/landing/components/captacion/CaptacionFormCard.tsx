import { Link } from 'react-router-dom';

import { useCaptacionForm } from '../../hooks/useCaptacionForm';
import { LeadIdentityStep } from './LeadIdentityStep';
import { LeadCredentialsStep } from './LeadCredentialsStep';
import { RegistroProgressSteps } from './RegistroProgressSteps';
import type { CaptacionSubmitResult } from '../../types/captacion-form';
import {
  PERU_MIN_DEPOSIT_LABEL,
  PERU_REGISTRO_FORM,
  PERU_REGISTRO_SPLIT,
} from '../../../../shared/copy/peru';
import {
  registroCardClass,
  registroSubtitleClass,
  registroSubtleClass,
  registroTitleClass,
} from './captacion-styles';

interface CaptacionFormCardProps {
  interest?: string;
  utmNotes?: string | null;
  onSuccess: (data: CaptacionSubmitResult) => void;
}

export function CaptacionFormCard({ interest, utmNotes, onSuccess }: CaptacionFormCardProps) {
  const captacion = useCaptacionForm({ interest, utmNotes, onSuccess });
  const copy = PERU_REGISTRO_FORM;
  const split = PERU_REGISTRO_SPLIT;

  return (
    <div id="registro" className={`${registroCardClass} scroll-mt-24`}>
      <RegistroProgressSteps currentStep={captacion.step} />

      <header className="mb-6">
        <h2 className={registroTitleClass}>
          {captacion.step === 1 ? split.formTitle : copy.step2Title}
        </h2>
        <p className={registroSubtitleClass}>
          {captacion.step === 1
            ? split.formSubtitle
            : copy.step2Subtitle}
        </p>
      </header>

      <div className="overflow-hidden">
        <div
          className="flex w-[200%] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: captacion.step === 1 ? 'translateX(0)' : 'translateX(-50%)' }}
        >
          <div className="w-1/2 shrink-0 pr-0">
            <LeadIdentityStep
              form={captacion.form}
              error={captacion.step === 1 ? captacion.error : null}
              onChange={captacion.updateField}
              onPatch={captacion.patchForm}
              onCountryChange={captacion.setCountry}
              onContinue={captacion.goToStep2}
            />
          </div>
          <div className="w-1/2 shrink-0 pl-0">
            <LeadCredentialsStep
              form={captacion.form}
              error={captacion.step === 2 ? captacion.error : null}
              isLoading={captacion.isLoading}
              maskedPhone={captacion.maskedPhone}
              canSubmit={captacion.canSubmitStep2}
              onChange={captacion.updateField}
              onBack={captacion.goToStep1}
              onSubmit={captacion.submit}
            />
          </div>
        </div>
      </div>

      <p className={`mt-5 text-center text-[11px] leading-relaxed ${registroSubtleClass}`}>
        {split.ageFootnote(PERU_MIN_DEPOSIT_LABEL)}
      </p>

      <div
        className={`mt-4 pt-4 border-t border-[#e8ebe6] flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] ${registroSubtleClass}`}
      >
        <Link
          to="/legal/terminos"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#163300] transition-colors"
        >
          T├®rminos
        </Link>
        <span aria-hidden>┬À</span>
        <Link
          to="/legal/privacidad"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#163300] transition-colors"
        >
          Privacidad
        </Link>
        <span aria-hidden>┬À</span>
        <Link
          to="/legal/riesgos"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#163300] transition-colors"
        >
          Riesgo
        </Link>
      </div>
    </div>
  );
}
