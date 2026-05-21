import { 
  Users, Activity, Headphones, AlertOctagon, 
  Shuffle, BarChart3, Clock, MessageSquare, PhoneCall, 
  FileText, Mic, Target, Zap, CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function TeamLeaderDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState('Estado de Mesa');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'monitor') setActiveTask('Estado de Mesa');
    if (tab === 'leads') setActiveTask('Leads de Mesa');
  }, [searchParams]);

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    if (taskId === 'Estado de Mesa') setSearchParams({ tab: 'monitor' });
    else if (taskId === 'Leads de Mesa') setSearchParams({ tab: 'leads' });
    else setSearchParams({});
  };

  const tlTasks = [
    { id: 'Estado de Mesa', icon: <Activity size={20} />, title: "Estado de Mesa", desc: "Agentes en vivo.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Leads de Mesa', icon: <Shuffle size={20} />, title: "Leads de Mesa", desc: "Reasignar leads.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Escucha de Llamadas', icon: <Headphones size={20} />, title: "Escucha Llamadas", desc: "Monitorear audio.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Alertas SOS', icon: <AlertOctagon size={20} />, title: "Alertas SOS", desc: "Apoyo urgente.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 'Minutaje', icon: <PhoneCall size={20} />, title: "Minutaje", desc: "Control de llamadas.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'KPIs de Mesa', icon: <BarChart3 size={20} />, title: "KPIs de Mesa", desc: "Conversión y FTDs.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'Control Asistencia', icon: <Clock size={20} />, title: "Asistencia", desc: "Check-in/out.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'Coaching Rápido', icon: <MessageSquare size={20} />, title: "Coaching", desc: "Notas a agentes.", color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: 'Ranking Mesa', icon: <Target size={20} />, title: "Ranking Mesa", desc: "Top performers.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { id: 'Reporte Diario', icon: <FileText size={20} />, title: "Reporte Diario", desc: "Cierre al Floor.", color: "text-gray-400", bg: "bg-gray-400/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Estado de Mesa':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500" /> Estado de Mi Mesa (6 Agentes)
            </h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Agente</th><th className="py-3 px-4">Estado</th><th className="py-3 px-4">FTDs Hoy</th><th className="py-3 px-4">Llamadas</th><th className="py-3 px-4">CR%</th><th className="py-3 px-4">Acción</th></tr>
              </thead>
              <tbody>
                {[
                  { n: 'Laura Gómez', s: 'En Llamada', f: 3, c: 65, cr: '4.6%', col: 'text-emerald-500' },
                  { n: 'Juan Pérez', s: 'Disponible', f: 1, c: 40, cr: '2.5%', col: 'text-amber-500' },
                  { n: 'María López', s: 'En Llamada', f: 2, c: 55, cr: '3.6%', col: 'text-emerald-500' },
                  { n: 'Diego Torres', s: 'Break', f: 0, c: 20, cr: '0.0%', col: 'text-red-500' },
                  { n: 'Sara Castro', s: 'En Llamada', f: 4, c: 78, cr: '5.1%', col: 'text-emerald-500' },
                  { n: 'Pedro Ruiz', s: 'Capacitación', f: 0, c: 0, cr: '0.0%', col: 'text-indigo-500' },
                ].map((ag, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{ag.n}</td>
                    <td className={`py-4 px-4 font-bold ${ag.col} flex items-center gap-2`}>
                      {ag.s === 'En Llamada' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                      {ag.s}
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-400 font-bold">{ag.f}</td>
                    <td className="py-4 px-4 font-mono text-gray-400">{ag.c}</td>
                    <td className="py-4 px-4 font-mono text-cyan-400">{ag.cr}</td>
                    <td className="py-4 px-4">
                      {ag.s === 'En Llamada' ? (
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors flex items-center gap-1"><Headphones size={12}/> Escuchar</button>
                      ) : ag.s === 'Break' ? (
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors">Llamar Atención</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Leads de Mesa':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shuffle className="text-purple-500" /> Leads de Mi Mesa (Reasignación Interna)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                <p className="font-bold text-purple-400 mb-4 border-b border-white/10 pb-2">Leads No Contactados (12)</p>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {['L-901 México', 'L-902 España', 'L-903 Colombia', 'L-904 Chile'].map((l, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded cursor-move hover:bg-white/10 border border-transparent hover:border-purple-500/50 flex justify-between items-center">
                      <span className="text-white text-sm">{l}</span>
                      <select className="bg-black border border-white/10 text-white rounded px-2 py-1 text-xs">
                        <option>Asignar a...</option>
                        <option>Laura Gómez</option>
                        <option>María López</option>
                        <option>Sara Castro</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                <p className="font-bold text-emerald-400 mb-4 border-b border-white/10 pb-2">Distribución Actual</p>
                {[
                  { n: 'Laura Gómez', l: 8 }, { n: 'Juan Pérez', l: 15 }, { n: 'Sara Castro', l: 5 },
                ].map((a, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-bold text-sm">{a.n}</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${a.l > 12 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{a.l} leads en cola</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Escucha de Llamadas':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Headphones /> Escucha Silenciosa (Coaching en Vivo)
            </h3>
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                <Mic size={28} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-blue-400 font-bold mb-1">Escuchando: Laura Gómez (AG-01)</p>
                <p className="text-white text-lg">Cliente: Ricardo Méndez | Objeción activa: "No entiendo cómo funciona el spread"</p>
                <div className="flex gap-4 mt-4">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors">Whisper (Ayudar)</button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition-colors">Desconectar</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Alertas SOS':
        return (
          <div className="bg-white/5 border border-rose-500/30 rounded-2xl p-6 shadow-xl animate-fade-in shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <h3 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
              <AlertOctagon className="animate-pulse" /> Alertas SOS de Mi Mesa
            </h3>
            <div className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/30 flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-lg">Juan Pérez pide auxilio</p>
                <p className="text-sm text-rose-400 mt-1">"El cliente quiere hablar con un supervisor para verificar la empresa"</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">Hace 30 segundos</p>
              </div>
              <button className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-lg transition-transform hover:scale-105 shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center gap-2">
                <Zap size={20} /> Conectar Ahora
              </button>
            </div>
          </div>
        );
      case 'Minutaje':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
              <PhoneCall /> Control de Minutaje (Hoy)
            </h3>
            <div className="space-y-3">
              {[
                { n: 'Laura Gómez', m: '4h 12m', c: 65, col: 'bg-emerald-500', w: 'w-[85%]' },
                { n: 'Sara Castro', m: '3h 55m', c: 78, col: 'bg-emerald-500', w: 'w-[80%]' },
                { n: 'María López', m: '3h 20m', c: 55, col: 'bg-blue-500', w: 'w-[68%]' },
                { n: 'Juan Pérez', m: '2h 10m', c: 40, col: 'bg-amber-500', w: 'w-[44%]' },
                { n: 'Diego Torres', m: '1h 05m', c: 20, col: 'bg-rose-500', w: 'w-[22%]' },
              ].map((a, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-bold text-sm">{a.n}</span>
                    <span className="text-gray-400 text-xs font-mono">{a.m} | {a.c} llamadas</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-2">
                    <div className={`${a.col} h-2 rounded-full ${a.w}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'KPIs de Mesa':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
              <BarChart3 /> KPIs de Mesa Consolidados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">FTDs Hoy</p>
                <p className="text-4xl font-black text-white">10</p>
                <p className="text-emerald-500 text-xs mt-1">Meta: 8 ✓</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">CR% Promedio</p>
                <p className="text-4xl font-black text-cyan-500">3.2%</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Volumen</p>
                <p className="text-4xl font-black text-white">$2.8k</p>
              </div>
              <div className="bg-black/30 p-5 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 text-xs font-bold mb-1">Leads Quemados</p>
                <p className="text-4xl font-black text-rose-500">23</p>
              </div>
            </div>
          </div>
        );
      case 'Control Asistencia':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
              <Clock /> Control de Asistencia
            </h3>
            <div className="space-y-3">
              {[
                { n: 'Laura Gómez', in: '08:02', out: '--:--', s: 'Activa' },
                { n: 'Diego Torres', in: '08:15', out: '--:--', s: 'En Break (32m)' },
                { n: 'Pedro Ruiz', in: '09:30', out: '--:--', s: 'Llegó tarde' },
              ].map((a, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-white font-bold">{a.n}</p>
                    <p className="text-gray-500 text-xs">Check-in: {a.in} | Check-out: {a.out}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.s === 'Activa' ? 'bg-emerald-500/20 text-emerald-400' : a.s.includes('Break') ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{a.s}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Coaching Rápido':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-pink-500 mb-6 flex items-center gap-2">
              <MessageSquare /> Coaching Rápido (Post-Llamada)
            </h3>
            <div className="flex gap-4">
              <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white w-1/3">
                <option>Seleccionar Agente...</option>
                <option>Laura Gómez</option>
                <option>Juan Pérez</option>
                <option>Diego Torres</option>
              </select>
              <input type="text" placeholder="Ej. 'Gran manejo de la objeción, pero cierra más rápido la próxima.'" className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" />
              <button className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">Enviar</button>
            </div>
          </div>
        );
      case 'Ranking Mesa':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
              <Target /> Ranking Interno (Mi Mesa)
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { p: 1, n: 'Sara Castro', f: 4, col: 'border-yellow-500/50 bg-yellow-500/10' },
                { p: 2, n: 'Laura Gómez', f: 3, col: 'border-white/10' },
                { p: 3, n: 'María López', f: 2, col: 'border-white/10' },
                { p: 4, n: 'Juan Pérez', f: 1, col: 'border-white/10 opacity-60' },
                { p: 5, n: 'Diego Torres', f: 0, col: 'border-rose-500/30 bg-rose-500/5' },
              ].map((a, i) => (
                <div key={i} className={`bg-black/30 p-4 rounded-xl border ${a.col} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-black ${a.p === 1 ? 'text-yellow-500 text-xl' : 'text-gray-500'}`}>#{a.p}</span>
                    <p className="font-bold text-white">{a.n}</p>
                  </div>
                  <p className={`font-bold ${a.f > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{a.f} FTDs</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Reporte Diario':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
              <FileText /> Reporte Diario (Cierre de Mesa)
            </h3>
            <div className="bg-black/30 p-6 rounded-xl border border-white/5 flex flex-col gap-4">
              <p className="text-gray-300 text-sm">Este reporte consolidará: Total FTDs (10), CR% promedio (3.2%), minutaje acumulado, incidencias y notas para el Floor Manager.</p>
              <textarea className="bg-black border border-white/10 text-white p-4 rounded-lg h-28 w-full resize-none" placeholder="Observaciones del día... Ej: 'Diego Torres llegó tarde y su desempeño fue nulo. Recomiendo PIP'." />
              <button className="bg-white text-black font-black px-6 py-3 rounded-lg w-max flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <CheckCircle2 size={18} /> Firmar y Enviar al Floor Manager
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
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
             <Users className="text-rose-400" /> Centro de Mando (Team Leader)
          </h1>
          <p className="text-gray-400 mt-2">Líder directo de tu mesa de agentes. Asegura que cada teléfono marque y cada lead se atienda.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Panel de Control (Selecciona Módulo)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {tlTasks.map((task, i) => (
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
