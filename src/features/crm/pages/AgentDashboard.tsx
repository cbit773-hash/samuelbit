import { 
  PhoneCall, Target, AlertTriangle, Phone, CheckCircle, 
  Calendar, MessageSquare, CreditCard, Trophy, 
  FileText, Shield, Coffee, Link as LinkIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function AgentDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState('Auto-Dialer');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'dialer') setActiveTask('Auto-Dialer');
    if (tab === 'ventas') setActiveTask('Mis Ventas (FTD)');
  }, [searchParams]);

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    if (taskId === 'Auto-Dialer') setSearchParams({ tab: 'dialer' });
    else if (taskId === 'Mis Ventas (FTD)') setSearchParams({ tab: 'ventas' });
    else setSearchParams({});
  };

  const agentTasks = [
    { id: 'Auto-Dialer', icon: <PhoneCall size={20} />, title: "Auto-Dialer", desc: "Marcación continua.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Mis Ventas (FTD)', icon: <Target size={20} />, title: "Mis Ventas (FTD)", desc: "Comisiones y cierres.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Callbacks', icon: <Calendar size={20} />, title: "Callbacks", desc: "Agenda de seguimientos.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Scripting', icon: <MessageSquare size={20} />, title: "Scripting", desc: "Guiones por objeción.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Botón SOS', icon: <AlertTriangle size={20} />, title: "Botón SOS", desc: "Ayuda del Floor Manager.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 'Cobro Rápido', icon: <CreditCard size={20} />, title: "Cobro Rápido", desc: "Links de pago a 1 clic.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'Ranking', icon: <Trophy size={20} />, title: "Ranking", desc: "Posición en la mesa.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { id: 'CRM Notas', icon: <FileText size={20} />, title: "CRM Notas", desc: "Historial del cliente.", color: "text-gray-400", bg: "bg-gray-400/10" },
    { id: 'KYC & Legal', icon: <Shield size={20} />, title: "KYC & Legal", desc: "Envío de PDFs.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: 'Estado Laboral', icon: <Coffee size={20} />, title: "Estado Laboral", desc: "Pausas y descansos.", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Auto-Dialer':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-black/40 border border-cyan-500/20 rounded-2xl p-8 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full"></div>
              <p className="text-cyan-400 text-sm font-bold tracking-widest mb-4 relative z-10 animate-pulse">EN LLAMADA (03:45)</p>
              <p className="text-5xl font-mono text-white font-black tracking-widest relative z-10 mb-4">+52 55 1234 5678</p>
              <div className="bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30 relative z-10">
                <p className="text-cyan-500 font-bold text-xl">Roberto Sánchez (L-890)</p>
                <p className="text-gray-400 text-sm mt-1">Lead Fresco - Origen: Meta Ads (Crypto)</p>
              </div>
              
              <div className="flex gap-6 mt-10 relative z-10">
                <button className="bg-rose-500 hover:bg-rose-600 text-white p-5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.4)]" title="Colgar / No Interesado">
                  <Phone size={28} className="rotate-[135deg]" />
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-black p-5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]" title="Agendar Callback">
                  <Calendar size={28} />
                </button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]" title="Cierre Exitoso (FTD)">
                  <CheckCircle size={28} />
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-4">
               <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                 <p className="text-gray-400 text-xs font-bold uppercase mb-2">Siguiente en cola</p>
                 <p className="text-white font-bold">María Fernández</p>
                 <p className="text-gray-500 text-sm">+34 600 123 456</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex-1 flex items-center justify-center">
                 <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-lg transition-colors flex items-center justify-center gap-2">
                   <PhoneCall size={20} /> Forzar Siguiente Lead
                 </button>
               </div>
            </div>
          </div>
        );
      case 'Mis Ventas (FTD)':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <Target /> Panel de Cierres y Comisiones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl text-center">
                <p className="text-gray-400 text-sm font-bold mb-2">FTDs (Mes)</p>
                <p className="text-5xl font-black text-white">12</p>
                <p className="text-emerald-500 text-xs font-bold mt-2">Bono Activo: +$50 c/u</p>
              </div>
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl text-center">
                <p className="text-gray-400 text-sm font-bold mb-2">Volumen de Retención</p>
                <p className="text-5xl font-black text-white">$4,200</p>
                <p className="text-blue-500 text-xs font-bold mt-2">Meta: $10,000</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center">
                <p className="text-emerald-400 text-sm font-bold mb-2">Comisión Estimada</p>
                <p className="text-5xl font-black text-emerald-500">$840</p>
                <p className="text-gray-400 text-xs font-bold mt-2">Pago este viernes</p>
              </div>
            </div>
          </div>
        );
      case 'Callbacks':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Calendar /> Agenda de Seguimientos (Hoy)
            </h3>
            <div className="space-y-4">
              <div className="bg-black/30 border border-l-4 border-l-blue-500 border-white/5 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-white font-bold text-lg">16:00 - Fernando Gómez</p>
                  <p className="text-gray-400 text-sm mt-1">Notas: "Sale de trabajar a las 4, dijo que tiene la tarjeta lista."</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">Llamar Ahora</button>
              </div>
              <div className="bg-black/30 border border-l-4 border-l-gray-500 border-white/5 p-4 rounded-xl flex justify-between items-center opacity-60">
                <div>
                  <p className="text-white font-bold text-lg">11:30 - Sara López</p>
                  <p className="text-gray-400 text-sm mt-1">Notas: "No contestó, reprogramado."</p>
                </div>
                <span className="text-xs bg-gray-500/20 px-2 py-1 rounded">Expirado</span>
              </div>
            </div>
          </div>
        );
      case 'Scripting':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-purple-500 mb-6 flex items-center gap-2">
              <MessageSquare /> Teleprompter de Objeciones
            </h3>
            <div className="flex gap-4 mb-6">
               <button className="bg-purple-500/20 text-purple-400 border border-purple-500/50 px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-500 hover:text-white transition-colors">No tengo dinero</button>
               <button className="bg-white/5 text-gray-400 border border-white/10 px-4 py-2 rounded-full text-sm font-bold hover:bg-white/10 transition-colors">Es una estafa</button>
               <button className="bg-white/5 text-gray-400 border border-white/10 px-4 py-2 rounded-full text-sm font-bold hover:bg-white/10 transition-colors">Lo voy a pensar</button>
            </div>
            <div className="bg-black/50 border border-purple-500/30 p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <p className="text-gray-400 text-sm mb-4 font-bold uppercase">Guión Sugerido (Mitigación de Liquidez):</p>
              <p className="text-white text-xl leading-relaxed font-light">
                "Entiendo perfectamente, Roberto. De hecho, la mayoría de mis clientes más rentables empezaron exactamente con esa misma duda. Pero aquí no estamos hablando de gastar dinero, estamos hablando de <strong className="text-purple-400 font-bold">activar tu portafolio</strong>. Con nuestro depósito mínimo fraccionado, puedes apartar tu posición hoy mismo y evitar que la oportunidad de mercado se cierre. ¿Tienes a mano tu tarjeta Visa o prefieres transferencia?"
              </p>
            </div>
          </div>
        );
      case 'Botón SOS':
         return (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-10 text-center shadow-xl animate-fade-in shadow-[0_0_40px_rgba(244,63,94,0.15)]">
            <AlertTriangle size={64} className="text-rose-500 mx-auto mb-6 animate-bounce" />
            <h3 className="text-3xl font-black text-rose-500 mb-4">¿El cliente se está cayendo?</h3>
            <p className="text-rose-300 max-w-lg mx-auto mb-8">
              Al presionar este botón, tu Floor Manager escuchará tu llamada inmediatamente y podrá intervenir (Take-Over) para salvar tu comisión.
            </p>
            <button className="bg-rose-600 hover:bg-rose-500 text-white text-2xl font-black px-12 py-6 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(244,63,94,0.6)]">
              ACTIVAR SOS (AYUDA EN VIVO)
            </button>
          </div>
        );
      case 'Cobro Rápido':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                <CreditCard /> Enlaces de Cobro Rápido
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-blue-500/50 transition-colors">
                  <CreditCard size={40} className="text-blue-500" />
                  <div>
                    <p className="text-white font-bold text-lg">Tarjeta Crédito / Débito</p>
                    <p className="text-gray-400 text-sm">Genera link seguro vía Stripe.</p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><LinkIcon size={16}/> Copiar Link (FTD $250)</button>
                </div>
                <div className="bg-black/30 border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-amber-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-black text-black">₿</div>
                  <div>
                    <p className="text-white font-bold text-lg">Depósito Crypto</p>
                    <p className="text-gray-400 text-sm">Dirección USDT (TRC20) o BTC.</p>
                  </div>
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><LinkIcon size={16}/> Mostrar QR / Dirección</button>
                </div>
              </div>
            </div>
          );
      case 'Ranking':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <Trophy /> Leaderboard (Tu Mesa)
              </h3>
              <div className="flex flex-col gap-3">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-500">#1</span>
                    <p className="font-bold text-white">Pedro Ruiz</p>
                  </div>
                  <p className="font-bold text-emerald-400">18 FTDs</p>
                </div>
                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/50 flex items-center justify-between shadow-[0_0_15px_rgba(234,179,8,0.1)] transform scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-black">#2</div>
                    <p className="font-bold text-white text-lg">Tú (AGENT-04)</p>
                  </div>
                  <p className="font-bold text-yellow-500 text-lg">12 FTDs</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-500">#3</span>
                    <p className="font-bold text-white">Ana Martínez</p>
                  </div>
                  <p className="font-bold text-emerald-400">9 FTDs</p>
                </div>
              </div>
              <p className="text-center text-gray-400 mt-6 text-sm">¡Estás a 6 FTDs del primer lugar y del bono de $500!</p>
            </div>
          );
      case 'CRM Notas':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
                <FileText /> CRM Rápido (Guardar estado)
              </h3>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                <p className="text-white font-bold mb-4">Lead Actual: Roberto Sánchez</p>
                <div className="flex gap-4 mb-4">
                   <select className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 w-1/3 outline-none focus:border-cyan-500">
                     <option>Estado: Callback</option>
                     <option>Estado: FTD Cerrado</option>
                     <option>Estado: No Interesado</option>
                     <option>Estado: Número Falso</option>
                   </select>
                </div>
                <textarea 
                  className="w-full bg-black border border-white/20 rounded-lg p-4 text-white h-32 outline-none focus:border-cyan-500 resize-none"
                  placeholder="Escribe detalles clave de la llamada. Ej: 'Cliente de 45 años, interesado en Crypto, no tiene tarjeta a la mano, llamar a las 4pm exactas'."
                />
                <div className="flex justify-end mt-4">
                  <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">Guardar y Pasar al Siguiente</button>
                </div>
              </div>
            </div>
          );
      case 'KYC & Legal':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-indigo-500 mb-6 flex items-center gap-2">
                <Shield /> Documentación Legal & KYC
              </h3>
              <p className="text-gray-400 text-sm mb-6">Si el cliente desconfía, envíale pruebas de regulación instantáneamente durante la llamada.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-black/30 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                   <span className="text-white font-bold text-sm">PDF - Términos y Condiciones</span>
                   <button className="text-xs bg-white/10 hover:bg-indigo-600 px-3 py-1 rounded text-white transition-colors">Enviar Email</button>
                 </div>
                 <div className="bg-black/30 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                   <span className="text-white font-bold text-sm">PDF - Licencia Regulatoria</span>
                   <button className="text-xs bg-white/10 hover:bg-indigo-600 px-3 py-1 rounded text-white transition-colors">Enviar Email</button>
                 </div>
                 <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl flex justify-between items-center md:col-span-2">
                   <span className="text-indigo-400 font-bold text-sm">Link de Verificación KYC (Subir Pasaporte)</span>
                   <button className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded font-bold text-white transition-colors">Copiar Enlace</button>
                 </div>
              </div>
            </div>
          );
      case 'Estado Laboral':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in text-center">
              <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center justify-center gap-2">
                <Coffee /> Control de Presencia
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Selecciona tu estado actual. Recuerda que los descansos mayores a 15 minutos alertarán a tu Floor Manager.</p>
              <div className="flex justify-center gap-4">
                 <button className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-600 hover:text-white transition-colors">Estoy Disponible (Ready)</button>
                 <button className="bg-orange-600 text-white font-black px-8 py-4 rounded-xl text-lg hover:bg-orange-500 transition-colors shadow-[0_0_15px_rgba(234,88,12,0.4)]">Pedir Permiso (Baño/Break)</button>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
             <PhoneCall className="text-cyan-500" /> Estación de Ventas (Closer)
          </h1>
          <p className="text-gray-400 mt-2">Eres la primera línea. Tu objetivo es contactar, convencer y cobrar. No dejes que la llamada se enfríe.</p>
        </div>
      </div>

      {/* 10 Tareas (Grid de Botones Interactivos) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Arsenal de Ventas (Selecciona Herramienta)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {agentTasks.map((task, i) => (
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

      {/* Área Dinámica */}
      <div className="min-h-[450px]">
        {renderContent()}
      </div>
    </div>
  );
}
