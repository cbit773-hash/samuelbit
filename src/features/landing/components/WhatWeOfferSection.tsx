import { Percent, Layers, Sliders, Smartphone, ActivitySquare, HeadphonesIcon } from 'lucide-react';
import { darkUi } from '../../../shared/theme/dark-ui';

export function WhatWeOfferSection() {
  const offers = [
    {
      icon: <Percent className="text-[#9fe870] mb-4" size={32} />,
      title: 'Apalancamiento Atractivo',
      desc: 'Hasta 1:500 para pares mayores de FX. Maximiza tu capital con márgenes flexibles.',
    },
    {
      icon: <Layers className="text-[#9fe870] mb-4" size={32} />,
      title: 'Amplia Gama de CFDs',
      desc: 'Diversifica tu cartera con acciones, índices globales, metales preciosos y criptos.',
    },
    {
      icon: <Sliders className="text-[#9fe870] mb-4" size={32} />,
      title: 'Cuentas Personalizadas',
      desc: 'Desde cuentas Silver hasta Platinum e Islámicas, adaptadas a tus necesidades únicas.',
    },
    {
      icon: <Smartphone className="text-[#9fe870] mb-4" size={32} />,
      title: 'Terminales Robustas',
      desc: 'Accede a los mercados desde tu navegador, tablet o móvil sin perder potencia.',
    },
    {
      icon: <ActivitySquare className="text-[#9fe870] mb-4" size={32} />,
      title: 'Spreads Inteligentes',
      desc: 'Un enfoque sólido que garantiza spreads ajustados desde 0.0 pips en liquidez profunda.',
    },
    {
      icon: <HeadphonesIcon className="text-[#9fe870] mb-4" size={32} />,
      title: 'Soporte Experto',
      desc: 'Asistencia cualificada para tus consultas. Tu éxito es nuestra prioridad.',
    },
  ];

  return (
    <div id="mercados-offer" className={`${darkUi.bgPage} py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${darkUi.textPrimary} mb-6`}>Lo que ofrecemos</h2>
          <p className={`${darkUi.textSecondary} text-lg`}>
            Comienza a explorar los mercados con el apoyo de InvestPRO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-6 ${darkUi.bgRaised} rounded-2xl border ${darkUi.border} hover:border-[rgba(159,232,112,0.35)] transition-colors`}
            >
              {offer.icon}
              <h3 className={`text-xl font-bold ${darkUi.textPrimary} mb-3`}>{offer.title}</h3>
              <p className={darkUi.textSecondary}>{offer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
