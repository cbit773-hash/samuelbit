import { 
  Thermometer, Activity, Headphones, AlertOctagon, 
  Shuffle, Recycle, Clock, MessageSquare, ArrowUpCircle, 
  FileText, Users, Mic, Target, Zap, CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function FloorDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState('Termómetro Diario');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'monitor') setActiveTask('Monitor In-Live');
    if (tab === 'reasignacion') setActiveTask('Reasignación');
  }, [searchParams]);

  // Actualizar URL cuando se hace clic manualmente en una tarea
  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    if (taskId === 'Monitor In-Live') setSearchParams({ tab: 'monitor' });
    else if (taskId === 'Reasignación') setSearchParams({ tab: 'reasignacion' });
    else setSearchParams({});
  };

  const floorTasks = [
    { id: 'Termómetro Diario', icon: <Thermometer size={20} />, title: "Termómetro Diario", desc: "Pacing FTD/Volumen.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'Monitor In-Live', icon: <Activity size={20} />, title: "Monitor In-Live", desc: "Estado de agentes.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Escucha Silenciosa', icon: <Headphones size={20} />, title: "Escucha Silenciosa", desc: "Barge-in / Whisper.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Alertas SOS', icon: <AlertOctagon size={20} />, title: "Alertas SOS", desc: "Take-Over urgente.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 'Reasignación', icon: <Shuffle size={20} />, title: "Reasignación", desc: "Drag & drop leads.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Pool de Reciclaje', icon: <Recycle size={20} />, title: "Pool Reciclaje", desc: "Trash to Cash.", color: "text-green-500", bg: "bg-green-500/10" },
    { id: 'Control Presencia', icon: <Clock size={20} />, title: "Control Presencia", desc: "Autorizar pausas.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Micro-Feedback', icon: <MessageSquare size={20} />, title: "Micro-Feedback", desc: "Notas de coaching 1:1.", color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: 'Upsell Push', icon: <ArrowUpCircle size={20} />, title: "Upsell Push", desc: "Retención en vivo.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: 'Reporte Turno', icon: <FileText size={20} />, title: "Reporte Turno", desc: "Handover al Manager.", color: "text-gray-400", bg: "bg-gray-400/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Termómetro Diario':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Thermometer className="text-orange-500" /> Termómetro Diario (Pacing de Piso)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl text-center flex flex-col gap-4">
                <div className="bg-emerald-500/20 p-4 rounded-full w-max mx-auto"><Target size={32} className="text-emerald-500" /></div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">FTDs Hoy (Tus Mesas)</p>
                  <p className="text-6xl font-black text-white mb-2">14 <span className="text-gray-500 text-2xl">/ 20</span></p>
                  <div className="w-full bg-black rounded-full h-4">
                    <div className="bg-emerald-500 h-4 rounded-full w-[70%] shadow-[0_0_15px_#10b981]"></div>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl text-center flex flex-col gap-4">
                <div className="bg-blue-500/20 p-4 rounded-full w-max mx-auto"><Activity size={32} className="text-blue-500" /></div>
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Volumen Retención Hoy</p>
                  <p className="text-5xl font-black text-white mb-2">$35k <span className="text-gray-500 text-xl">/ $50k</span></p>
                  <div className="w-full bg-black rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full w-[70%] shadow-[0_0_15px_#3b82f6]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Monitor In-Live':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500" /> Monitor In-Live (Mapa de Piso)
            </h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Agente</th><th className="py-3 px-4">Estado</th><th className="py-3 px-4">Tiempo en Estado</th><th className="py-3 px-4">Acción</th></tr>
              </thead>
              <tbody>
                {[
                  { a: 'Carlos Díaz', s: 'En Llamada', t: '12:45 min', col: 'text-emerald-500' },
                  { a: 'Ana M.', s: 'Disponible', t: '01:20 min', col: 'text-amber-500' },
                  { a: 'Pedro Ruiz', s: 'Descanso', t: '16:00 min', col: 'text-red-500' }
                ].map((ag, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{ag.a}</td>
                    <td className={`py-4 px-4 font-bold ${ag.col} flex items-center gap-2`}>
                      {ag.s === 'En Llamada' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                      {ag.s}
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-400">{ag.t}</td>
                    <td className="py-4 px-4">
                      {ag.s === 'En Llamada' ? (
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors">Barge-in</button>
                      ) : ag.s === 'Descanso' ? (
                         <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors">Forzar Ready</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Escucha Silenciosa':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Headphones className="text-blue-500" /> Escucha Silenciosa y Whisper
            </h3>
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                <Mic size={32} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-blue-400 font-bold mb-1">CONECTADO: AG-01 (Carlos Díaz)</p>
                <p className="text-white text-lg">Cliente: Fernando Guzmán (Objeción: No tengo liquidez)</p>
                <div className="flex gap-4 mt-4">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors shadow-lg shadow-blue-500/30">Whisper (Hablar al Agente)</button>
                  <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded transition-colors shadow-lg shadow-rose-500/30">Take-Over (Tomar Llamada)</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Alertas SOS':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <h3 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
              <AlertOctagon className="animate-pulse" /> Alertas SOS (Panic Button Activos)
            </h3>
            <div className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/30 flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-lg">Mesa 2 - Ana Martínez</p>
                <p className="text-sm text-rose-400 mt-1">"Cliente VIP ($10k) quiere colgar, me pide rebaja en spreads."</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">Enviado: Hace 45 segundos</p>
              </div>
              <button className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-lg transition-transform hover:scale-105 shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center gap-2">
                <Zap size={20} /> INTERVENIR AHORA
              </button>
            </div>
          </div>
        );
      case 'Reasignación':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shuffle className="text-purple-500" /> Distribución Táctica (Drag & Drop)
            </h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                 <p className="font-bold text-gray-400 mb-4 border-b border-white/10 pb-2">Pool Libre (Sin asignar)</p>
                 <div className="flex flex-col gap-2">
                   <div className="bg-white/5 p-3 rounded cursor-move hover:bg-white/10 border border-transparent hover:border-purple-500/50">Lead: L-9821 (México)</div>
                   <div className="bg-white/5 p-3 rounded cursor-move hover:bg-white/10 border border-transparent hover:border-purple-500/50">Lead: L-9822 (España)</div>
                 </div>
               </div>
               <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                 <p className="font-bold text-emerald-400 mb-4 border-b border-white/10 pb-2">Agentes Disponibles</p>
                 <div className="flex flex-col gap-2">
                   <div className="border border-emerald-500/30 bg-emerald-500/5 p-3 rounded flex justify-between items-center">
                     <span className="text-white font-bold">Pedro R.</span>
                     <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded">Listo (0 leads cola)</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );
      case 'Pool de Reciclaje':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Recycle className="text-green-500" /> Pool de Reciclaje (Trash to Cash)
              </h3>
              <p className="text-sm text-gray-400 mb-6">Leads marcados como "No interesado" por novatos en las últimas 4 horas. Listos para reasignación a Closers.</p>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                  <tr><th className="py-3 px-4">Lead ID</th><th className="py-3 px-4">Descartado por</th><th className="py-3 px-4">Motivo Original</th><th className="py-3 px-4">Asignar a Closer</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-mono text-white">L-8842</td>
                    <td className="py-4 px-4 text-gray-400">Juan P. (Novato)</td>
                    <td className="py-4 px-4 text-rose-400 text-xs">"Dijo que no tiene tiempo."</td>
                    <td className="py-4 px-4">
                      <select className="bg-black border border-white/10 text-white rounded px-2 py-1 text-xs">
                        <option>Seleccionar Closer...</option>
                        <option>Carlos Díaz (Senior)</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
      case 'Control Presencia':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-cyan-500" /> Control de Presencia y Baños
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-500/10 p-5 rounded-xl border border-cyan-500/20">
                  <p className="text-white font-bold text-lg mb-2">Solicitudes Pendientes</p>
                  <div className="bg-black/50 p-3 rounded flex justify-between items-center">
                    <span className="text-gray-300">Juan Pérez - Permiso 15m (Almuerzo)</span>
                    <div className="flex gap-2">
                      <button className="bg-emerald-600 px-3 py-1 rounded text-xs font-bold text-white">Aprobar</button>
                      <button className="bg-rose-600 px-3 py-1 rounded text-xs font-bold text-white">Rechazar</button>
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <p className="text-white font-bold text-lg mb-2">Agentes Fuera del Piso</p>
                  <p className="text-sm text-gray-400 mb-1">Marta S. - Baño (04:12 min)</p>
                  <p className="text-sm text-rose-400">Diego L. - Almuerzo (65:00 min) - OVERDUE</p>
                </div>
              </div>
            </div>
          );
      case 'Micro-Feedback':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-pink-500" /> Micro-Feedback (1-on-1)
              </h3>
              <div className="flex gap-4">
                <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white w-1/3">
                  <option>Seleccionar Agente...</option>
                  <option>Carlos Díaz</option>
                  <option>Ana Martínez</option>
                </select>
                <input type="text" placeholder="Ej. 'Te faltó empatía en la intro, recuerda la regla de 3'." className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" />
                <button className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">Enviar Nota al Agente</button>
              </div>
            </div>
          );
      case 'Upsell Push':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowUpCircle className="text-indigo-500" /> Empuje de Retención (Upsell Push)
              </h3>
              <p className="text-sm text-gray-400 mb-6">Clientes que hicieron un FTD hoy. Es el mejor momento para llamar e intentar triplicar la cuenta (Efecto Dopamina).</p>
              <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-lg">Cliente: Luis Ramos (FTD: $250 hace 1 hr)</p>
                  <p className="text-sm text-indigo-300">Asignado a: Carlos Díaz</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">Forzar Llamada de Retención</button>
              </div>
            </div>
          );
      case 'Reporte Turno':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="text-gray-400" /> Cierre de Turno (Shift Handover)
              </h3>
              <div className="bg-black/30 p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                <p className="text-gray-300 text-sm">El reporte consolidará: FTDs (14), Volumen ($35k), Llamadas Realizadas (1,420), Tiempos de descanso y Notas de coaching.</p>
                <textarea className="bg-black border border-white/10 text-white p-4 rounded-lg h-32 w-full" placeholder="Comentarios adicionales para el Manager... Ej. 'El tráfico de las 4PM fue muy malo, mucha objeción de falta de dinero'." />
                <button className="bg-white text-black font-black px-6 py-3 rounded-lg w-max flex items-center gap-2 hover:bg-gray-200 transition-colors">
                  <CheckCircle2 size={18} /> Firmar y Enviar a Management
                </button>
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
             <Zap className="text-amber-400" /> Monitoreo de Piso (Floor Manager)
          </h1>
          <p className="text-gray-400 mt-2">Comandante de trinchera: Resuelve objeciones en vivo, inyecta energía y asegura el FTD diario de tus mesas.</p>
        </div>
      </div>

      {/* 10 Tareas (Grid de Botones Interactivos) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Herramientas de Trinchera (Selecciona Acción)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {floorTasks.map((task, i) => (
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
