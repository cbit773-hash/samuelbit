import { Shield, Clock, BadgeCheck } from 'lucide-react';
import { darkUi } from '../../../shared/theme/dark-ui';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <BadgeCheck size={40} className="text-[#9fe870]" />,
      title: 'Confiabilidad',
      description:
        'InvestPRO es un bróker regulado y transparente. Operamos bajo los más estrictos estándares financieros internacionales.',
    },
    {
      icon: <Shield size={40} className="text-[#9fe870]" />,
      title: 'Seguridad de Fondos',
      description:
        'Cuentas segregadas y encriptación de grado militar. Tus depósitos y retiros se procesan mediante pasarelas auditadas.',
    },
    {
      icon: <Clock size={40} className="text-[#9fe870]" />,
      title: 'Asistencia Continua',
      description:
        'Un equipo de soporte multilingüe dedicado 24/5 está a tu servicio para resolver cualquier incidencia técnica o comercial.',
    },
  ];

  return (
    <div id="empresa" className={`${darkUi.bgPanel} py-24 border-t ${darkUi.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${darkUi.textPrimary} mb-6`}>
            El socio de confianza que necesitas
          </h2>
          <p className={`${darkUi.textSecondary} text-lg`}>
            En el mundo acelerado del comercio de CFDs y mercados volátiles, tener un ecosistema seguro es crucial.
            En InvestPRO priorizamos tu tranquilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className={`${darkUi.bgRaised} border ${darkUi.border} rounded-2xl p-8 hover:bg-[#3a3e42] transition-colors group`}
            >
              <div
                className={`${darkUi.bgInset} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {b.icon}
              </div>
              <h3 className={`text-2xl font-bold ${darkUi.textPrimary} mb-4`}>{b.title}</h3>
              <p className={`${darkUi.textSecondary} leading-relaxed`}>{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
