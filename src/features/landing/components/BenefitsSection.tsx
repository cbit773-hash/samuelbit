import { Shield, Clock, BadgeCheck } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <BadgeCheck size={40} className="text-primary" />,
      title: "Confiabilidad",
      description: "InvestPRO es un bróker regulado y transparente. Operamos bajo los más estrictos estándares financieros internacionales."
    },
    {
      icon: <Shield size={40} className="text-primary" />,
      title: "Seguridad de Fondos",
      description: "Cuentas segregadas y encriptación de grado militar. Tus depósitos y retiros se procesan mediante pasarelas auditadas."
    },
    {
      icon: <Clock size={40} className="text-primary" />,
      title: "Asistencia Continua",
      description: "Un equipo de soporte multilingüe dedicado 24/5 está a tu servicio para resolver cualquier incidencia técnica o comercial."
    }
  ];

  return (
    <div id="empresa" className="bg-[#0a0a0a] py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">El socio de confianza que necesitas</h2>
          <p className="text-gray-400 text-lg">
            En el mundo acelerado del comercio de CFDs y mercados volátiles, tener un ecosistema seguro es crucial. En InvestPRO priorizamos tu tranquilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group">
              <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {b.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{b.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
