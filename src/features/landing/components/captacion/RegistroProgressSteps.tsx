import type { CaptacionStep } from '../../types/captacion-form';

const STEPS = [
  { id: 1 as CaptacionStep, label: 'Datos' },
  { id: 2 as CaptacionStep, label: 'Confirmar' },
] as const;

interface RegistroProgressStepsProps {
  currentStep: CaptacionStep;
}

export function RegistroProgressSteps({ currentStep }: RegistroProgressStepsProps) {
  return (
    <nav aria-label="Progreso del registro" className="mb-6">
      <div className="flex items-center gap-2">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  isActive || isDone ? 'bg-brand' : 'bg-[#e8ebe6]'
                }`}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-[#454745] mt-2 font-semibold registro-text-muted">
        Paso {currentStep} de {STEPS.length} — {STEPS[currentStep - 1].label}
      </p>
    </nav>
  );
}
