import { ShieldCheck, Scale, FileText, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

export function LegalView() {
  const pillars = [
    {
      title: "Términos y Condiciones",
      icon: <FileText size={32} className="text-primary mb-4" />,
      status: "Aceptados",
      description: "Acuerdos legales globales que rigen el uso de la plataforma InvestPRO, incluyendo responsabilidades del usuario y riesgos operativos."
    },
    {
      title: "Regulación Internacional",
      icon: <Scale size={32} className="text-primary mb-4" />,
      status: "Cumplimiento Total",
      description: "Operamos bajo normativas estrictas de jurisdicciones internacionales. Los fondos de los clientes están segregados de los fondos operativos."
    },
    {
      title: "KYC / AML",
      icon: <UserCheck size={32} className="text-primary mb-4" />,
      status: "Verificado (Nivel 2)",
      description: "Políticas de Conoce a tu Cliente (KYC) y Prevención de Lavado de Dinero (AML) requeridas para operar sin restricciones."
    },
    {
      title: "Protección de Datos (GDPR)",
      icon: <Lock size={32} className="text-primary mb-4" />,
      status: "Activo",
      description: "Tus datos personales están encriptados bajo AES-256. Cumplimos con los lineamientos del Reglamento General de Protección de Datos."
    }
  ];

  return (
    <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
            <ShieldCheck size={20} /> InvestPRO LEGAL
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Centro de Cumplimiento y Seguridad</h1>
          <p className="text-gray-400 mt-2">Transparencia absoluta. Revisa el estado legal y regulatorio de tu cuenta y de la plataforma.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all group shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              {pillar.icon}
            </div>
            
            {pillar.icon}
            <h2 className="text-2xl font-bold text-white mb-2">{pillar.title}</h2>
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold mb-4">
              <CheckCircle2 size={14} /> {pillar.status}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">{pillar.description}</p>
            
            <button className="mt-6 text-sm font-semibold text-primary hover:text-amber-500 flex items-center gap-1 group-hover:underline">
              Ver documento completo
            </button>
          </div>
        ))}
      </div>

      {/* Auditoría Section */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 mt-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-white/5 p-4 rounded-full">
            <ShieldCheck size={40} className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Auditorías de Seguridad Continuas</h3>
            <p className="text-gray-400 text-sm mt-1">Los contratos inteligentes de InvestPRO y su infraestructura son auditados trimestralmente.</p>
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors shrink-0">
          Descargar Reporte (Q1 2026)
        </button>
      </div>
    </div>
  );
}
