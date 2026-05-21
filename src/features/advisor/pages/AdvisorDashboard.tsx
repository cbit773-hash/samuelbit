import { 
  PhoneCall, TrendingUp, DollarSign, Users, AlertTriangle,
  Briefcase, HeartHandshake, BarChart3, MessageSquare, Gift,
  ShieldCheck, FileText, Activity, Target, Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function AdvisorDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState('Cartera Activa');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'cartera') setActiveTask('Cartera Activa');
    if (tab === 'upsell') setActiveTask('Upsell Pipeline');
  }, [searchParams]);

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    if (taskId === 'Cartera Activa') setSearchParams({ tab: 'cartera' });
    else if (taskId === 'Upsell Pipeline') setSearchParams({ tab: 'upsell' });
    else setSearchParams({});
  };

  const advisorTasks = [
    { id: 'Cartera Activa', icon: <Briefcase size={20} />, title: "Cartera Activa", desc: "Clientes y equidad.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Upsell Pipeline', icon: <TrendingUp size={20} />, title: "Upsell Pipeline", desc: "Depósitos pendientes.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Rescate Anti-Churn', icon: <HeartHandshake size={20} />, title: "Anti-Churn", desc: "Retener VIPs.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 'Llamada de Retención', icon: <PhoneCall size={20} />, title: "Llamada Retención", desc: "Contactar clientes.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Monitor PnL', icon: <Activity size={20} />, title: "Monitor PnL", desc: "Pérdidas y ganancias.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'Alertas de Margen', icon: <AlertTriangle size={20} />, title: "Alertas Margen", desc: "Margin calls.", color: "text-red-500", bg: "bg-red-500/10" },
    { id: 'Programa VIP', icon: <Gift size={20} />, title: "Programa VIP", desc: "Beneficios premium.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'KPIs Retención', icon: <BarChart3 size={20} />, title: "KPIs Retención", desc: "Métricas de cartera.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'CRM Notas', icon: <MessageSquare size={20} />, title: "CRM Notas", desc: "Historial de cuenta.", color: "text-gray-400", bg: "bg-gray-400/10" },
    { id: 'Compliance', icon: <ShieldCheck size={20} />, title: "Compliance", desc: "Documentos y KYC.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Cartera Activa':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-blue-500" /> Mi Cartera de Clientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 border border-white/5 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">AUM (Activos Bajo Gestión)</p>
                <p className="text-4xl font-black text-white">$216k</p>
              </div>
              <div className="bg-black/30 border border-white/5 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">Clientes Activos</p>
                <p className="text-4xl font-black text-blue-500">18</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl text-center">
                <p className="text-emerald-400 text-xs font-bold mb-1">Comisión del Mes</p>
                <p className="text-4xl font-black text-emerald-500">$3,420</p>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Cliente</th><th className="py-3 px-4">Equidad</th><th className="py-3 px-4">PnL</th><th className="py-3 px-4">Últ. Depósito</th><th className="py-3 px-4">Acción</th></tr>
              </thead>
              <tbody>
                {[
                  { n: 'Carlos Mendoza', e: '$45,000', p: '+$1,200', d: 'Hace 3 días', col: 'text-emerald-500' },
                  { n: 'Laura Gómez', e: '$12,500', p: '-$350', d: 'Hace 15 días', col: 'text-rose-500' },
                  { n: 'Grupo Alpha', e: '$150,000', p: '+$8,500', d: 'Ayer', col: 'text-emerald-500' },
                  { n: 'Sofía Reyes', e: '$8,900', p: '+$45', d: 'Hace 30 días', col: 'text-amber-500' },
                ].map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{c.n}</td>
                    <td className="py-4 px-4 font-mono text-white">{c.e}</td>
                    <td className={`py-4 px-4 font-mono font-bold ${c.col}`}>{c.p}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{c.d}</td>
                    <td className="py-4 px-4">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors">Llamar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Upsell Pipeline':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <TrendingUp /> Pipeline de Upsell (Retención de Capital)
            </h3>
            <p className="text-sm text-gray-400 mb-6">Clientes con alta probabilidad de depositar más. Usa el "Efecto Dopamina": llámalos cuando van ganando.</p>
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-lg">Carlos Mendoza (PnL: +$1,200)</p>
                  <p className="text-emerald-300 text-sm">"Va ganando. Momento perfecto para proponer ampliar margen a $20k más."</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold">Llamar Ahora</button>
                  <button className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm">Agendar</button>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-lg">Grupo Alpha (AUM: $150k)</p>
                  <p className="text-blue-300 text-sm">"Cliente institucional. Ofrecer cuenta VIP con spreads reducidos a cambio de $50k más."</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">Programar Reunión</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Rescate Anti-Churn':
        return (
          <div className="bg-white/5 border border-rose-500/30 rounded-2xl p-6 shadow-xl animate-fade-in shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <h3 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
              <HeartHandshake /> Rescate Anti-Churn (Clientes en Riesgo)
            </h3>
            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-lg flex items-center gap-2"><AlertTriangle size={16} className="text-rose-500" /> Laura Gómez</p>
                  <p className="text-sm text-rose-400 mt-1">PnL: -$350 | Inactiva hace 15 días | Solicitud de retiro pendiente ($5,000)</p>
                </div>
                <button className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                  INTERVENIR
                </button>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-lg">Sofía Reyes</p>
                  <p className="text-sm text-amber-400 mt-1">Sin operar hace 30 días. Balance estancado. Alto riesgo de abandono.</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold">Llamar y Reactivar</button>
              </div>
            </div>
          </div>
        );
      case 'Llamada de Retención':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-black/40 border border-cyan-500/20 rounded-2xl p-8 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full"></div>
              <p className="text-cyan-400 text-sm font-bold tracking-widest mb-4 relative z-10 animate-pulse">LLAMADA DE RETENCIÓN (08:22)</p>
              <p className="text-4xl font-mono text-white font-black tracking-widest relative z-10 mb-4">Laura Gómez</p>
              <p className="text-gray-400 relative z-10">Equidad: $12,500 | PnL: -$350 | Solicitud de retiro activa</p>
              <div className="flex gap-6 mt-8 relative z-10">
                <button className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full transition-transform hover:scale-105"><PhoneCall size={24} className="rotate-[135deg]" /></button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full transition-transform hover:scale-105"><DollarSign size={24} /></button>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-black/30 border border-white/5 p-4 rounded-xl">
              <p className="text-gray-400 text-xs font-bold uppercase mb-3">Script de Retención</p>
              <p className="text-white text-sm leading-relaxed">"Laura, entiendo que la volatilidad puede ser incómoda, pero déjame mostrarte algo: las cuentas que retiran en pérdida pierden la oportunidad de la recuperación natural del mercado. Nuestros analistas detectaron que tu posición está a <strong className="text-cyan-400">48 horas de zona de beneficio</strong>. ¿Qué te parece si congelamos el retiro 72 horas?"</p>
            </div>
          </div>
        );
      case 'Monitor PnL':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
              <Activity /> Monitor de PnL (Todas mis Cuentas)
            </h3>
            <div className="space-y-3">
              {[
                { n: 'Carlos Mendoza', pnl: '+$1,200', eq: '$45k', col: 'border-l-emerald-500', t: 'text-emerald-500' },
                { n: 'Grupo Alpha', pnl: '+$8,500', eq: '$150k', col: 'border-l-emerald-500', t: 'text-emerald-500' },
                { n: 'Sofía Reyes', pnl: '+$45', eq: '$8.9k', col: 'border-l-amber-500', t: 'text-amber-500' },
                { n: 'Laura Gómez', pnl: '-$350', eq: '$12.5k', col: 'border-l-rose-500', t: 'text-rose-500' },
              ].map((c, i) => (
                <div key={i} className={`bg-black/30 p-4 rounded-xl border border-l-4 ${c.col} border-white/5 flex justify-between items-center`}>
                  <div>
                    <p className="text-white font-bold">{c.n}</p>
                    <p className="text-gray-500 text-xs">Equidad: {c.eq}</p>
                  </div>
                  <p className={`font-mono font-black text-xl ${c.t}`}>{c.pnl}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Alertas de Margen':
        return (
          <div className="bg-white/5 border border-red-500/30 rounded-2xl p-6 shadow-xl animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
              <AlertTriangle className="animate-pulse" /> Alertas de Margen (Margin Calls)
            </h3>
            <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/30">
              <p className="font-bold text-white text-lg">Laura Gómez - Nivel de Margen: 42%</p>
              <p className="text-red-400 text-sm mt-1">Si baja de 20%, se ejecutará Stop-Out automático. Equidad flotando en $12,500.</p>
              <div className="flex gap-4 mt-4">
                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Llamar (Depositar Margen)</button>
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm">Notificar por Email</button>
              </div>
            </div>
          </div>
        );
      case 'Programa VIP':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-purple-500 mb-6 flex items-center gap-2">
              <Gift /> Programa VIP (Beneficios)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 border border-white/5 p-5 rounded-xl text-center hover:border-purple-500/50 transition-colors">
                <p className="text-2xl mb-2">🥉</p>
                <p className="font-bold text-white">Silver</p>
                <p className="text-gray-400 text-xs mt-1">Depósito: $5k+</p>
                <p className="text-purple-400 text-sm mt-2">Spread -10%</p>
              </div>
              <div className="bg-black/30 border border-white/5 p-5 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                <p className="text-2xl mb-2">🥇</p>
                <p className="font-bold text-white">Gold</p>
                <p className="text-gray-400 text-xs mt-1">Depósito: $25k+</p>
                <p className="text-amber-400 text-sm mt-2">Spread -25% + Analista</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl text-center">
                <p className="text-2xl mb-2">💎</p>
                <p className="font-bold text-white">Diamond</p>
                <p className="text-gray-400 text-xs mt-1">Depósito: $100k+</p>
                <p className="text-purple-400 text-sm mt-2">Spread -50% + Manager Dedicado</p>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-6 text-sm">Grupo Alpha califica para Diamond. ¡Ofrécelo en la próxima llamada!</p>
          </div>
        );
      case 'KPIs Retención':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
              <BarChart3 /> KPIs de Retención
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Retención (90 días)</p>
                <p className="text-4xl font-black text-emerald-500">78%</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Upsells (Mes)</p>
                <p className="text-4xl font-black text-white">$32k</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Ticket Promedio</p>
                <p className="text-4xl font-black text-blue-500">$12k</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Churn Rate</p>
                <p className="text-4xl font-black text-rose-500">5.2%</p>
              </div>
            </div>
          </div>
        );
      case 'CRM Notas':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
              <MessageSquare /> CRM (Historial de Cuenta)
            </h3>
            <div className="flex gap-4 mb-4">
              <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white w-1/3">
                <option>Seleccionar Cliente...</option>
                <option>Carlos Mendoza</option>
                <option>Laura Gómez</option>
                <option>Grupo Alpha</option>
              </select>
            </div>
            <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white h-32 resize-none" placeholder="Notas sobre la llamada de retención... Ej: 'Laura aceptó congelar retiro 48h, prometió revisar el viernes'." />
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">Guardar en Expediente</button>
            </div>
          </div>
        );
      case 'Compliance':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-indigo-500 mb-6 flex items-center gap-2">
              <ShieldCheck /> Compliance & Documentos KYC
            </h3>
            <div className="space-y-3">
              {[
                { n: 'Carlos Mendoza', k: 'Verificado', col: 'bg-emerald-500/20 text-emerald-400' },
                { n: 'Laura Gómez', k: 'Verificado', col: 'bg-emerald-500/20 text-emerald-400' },
                { n: 'Grupo Alpha', k: 'Pendiente Documentos', col: 'bg-amber-500/20 text-amber-400' },
                { n: 'Sofía Reyes', k: 'Expirado', col: 'bg-rose-500/20 text-rose-400' },
              ].map((c, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <p className="text-white font-bold">{c.n}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.col}`}>{c.k}</span>
                    {c.k !== 'Verificado' && <button className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-white font-bold">Reenviar Link KYC</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
             <HeartHandshake className="text-blue-400" /> Panel de Retención (Advisor)
          </h1>
          <p className="text-gray-400 mt-2">Tu misión: que cada dólar que entra se quede y se multiplique. Retén, upsell, protege.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Herramientas de Retención (Selecciona Módulo)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {advisorTasks.map((task, i) => (
            <div 
              key={i} 
              onClick={() => handleTaskChange(task.id)}
              className={`border rounded-xl p-4 transition-all cursor-pointer group ${
                activeTask === task.id ? `bg-white/10 border-${task.color.split('-')[1]}-500/50 shadow-[0_0_15px_currentColor]` : 'bg-white/5 border-white/10 hover:bg-white/10'
              } ${task.color}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${task.bg} ${task.color} group-hover:scale-110 transition-transform`}>
                {task.icon}
              </div>
              <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">{task.title}</h3>
              <p className="text-[10px] text-gray-400 leading-tight">{task.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[450px]">
        {renderContent()}
      </div>
    </div>
  );
}
