import { 
  TrendingUp, Headphones, BookOpen, Trophy, AlertTriangle, 
  Flame, Clock, MessageSquare, DollarSign, ShieldAlert, 
  Target, Award, PlayCircle, BarChart, CheckCircle, UserX, 
  Calculator, LifeBuoy, Users, Star
} from 'lucide-react';
import { useState } from 'react';

export function ManagerDashboard() {
  const [activeTask, setActiveTask] = useState('Radar de Metas');

  const managerTasks = [
    { id: 'Radar de Metas', icon: <Target size={20} />, title: "Radar de Metas", desc: "Monitoreo FTD y Retención.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'QA de Llamadas', icon: <Headphones size={20} />, title: "QA de Llamadas", desc: "Auditoría de pitches.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Academy & Training', icon: <BookOpen size={20} />, title: "Academy & Training", desc: "Cursos y nivelación.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Leaderboard', icon: <Trophy size={20} />, title: "Leaderboard", desc: "Ranking de agentes.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'PIPs', icon: <AlertTriangle size={20} />, title: "PIPs (Mejora)", desc: "Intervención bajo RTO.", color: "text-red-500", bg: "bg-red-500/10" },
    { id: 'Mapa de Calor', icon: <Flame size={20} />, title: "Mapa de Calor", desc: "Conversión por fuentes.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'Control de Presencia', icon: <Clock size={20} />, title: "Control de Presencia", desc: "Auditoría de pausas.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Análisis de Objeciones', icon: <MessageSquare size={20} />, title: "Análisis Objeciones", desc: "Mapeo de rechazos.", color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: 'Simulador de Bonos', icon: <Calculator size={20} />, title: "Simulador de Bonos", desc: "Incentivos y nómina.", color: "text-green-500", bg: "bg-green-500/10" },
    { id: 'Rescate de VIPs', icon: <LifeBuoy size={20} />, title: "Rescate de VIPs", desc: "Alerta Anti-Churn.", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Radar de Metas':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-emerald-500" /> Radar de Metas Globales (Pacing)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-4">
                <div className="bg-emerald-500/20 p-4 rounded-full"><Target size={32} className="text-emerald-500" /></div>
                <div className="w-full">
                  <p className="text-gray-400 font-semibold mb-1">Meta de FTDs (Semana)</p>
                  <p className="text-5xl font-black text-white mb-2">142 <span className="text-gray-500 text-xl">/ 200</span></p>
                  <div className="w-full bg-black rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full w-[71%] shadow-[0_0_10px_#10b981]"></div>
                  </div>
                  <p className="text-xs text-emerald-400 mt-2 font-bold">Pacing: En verde (Proyección: 210 FTDs)</p>
                </div>
              </div>
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-4">
                <div className="bg-blue-500/20 p-4 rounded-full"><Award size={32} className="text-blue-500" /></div>
                <div className="w-full">
                  <p className="text-gray-400 font-semibold mb-1">Meta de Retención</p>
                  <p className="text-5xl font-black text-white mb-2">$450k <span className="text-gray-500 text-xl">/ $600k</span></p>
                  <div className="w-full bg-black rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full w-[75%] shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
                  <p className="text-xs text-blue-400 mt-2 font-bold">Pacing: Ligeramente atrasado (Faltan $150k)</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'QA de Llamadas':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Headphones className="text-blue-500" /> Quality Assurance (Grabaciones)
            </h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Agente</th><th className="py-3 px-4">Duración</th><th className="py-3 px-4">Objeción Principal</th><th className="py-3 px-4">Resultado</th><th className="py-3 px-4">Acción</th></tr>
              </thead>
              <tbody>
                {[
                  { a: 'Carlos R.', d: '14:20', o: 'No tengo tiempo', r: 'No Interesado' },
                  { a: 'Ana M.', d: '08:45', o: 'Miedo al riesgo', r: 'Cita Agendada' },
                  { a: 'Luis S.', d: '22:10', o: 'Consulta con esposa', r: 'No Interesado' }
                ].map((l, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{l.a}</td>
                    <td className="py-4 px-4 font-mono text-gray-400">{l.d}</td>
                    <td className="py-4 px-4 text-gray-300">"{l.o}"</td>
                    <td className="py-4 px-4 text-amber-500 text-xs font-bold">{l.r}</td>
                    <td className="py-4 px-4">
                      <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="Escuchar"><PlayCircle size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Academy & Training':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="text-purple-500" /> Módulos de Entrenamiento Activos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { t: 'Técnicas de Cierre Crypto (V2)', c: '45/50 Agentes', s: 'Crítico' },
                { t: 'Mitigación de Objeciones (Nivel 1)', c: '12/50 Agentes', s: 'Opcional' },
                { t: 'Compliance y AML Básico', c: '50/50 Agentes', s: 'Completado' }
              ].map((m, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{m.t}</p>
                    <p className="text-xs text-gray-400 mt-1">Avance: {m.c}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.s === 'Crítico' ? 'bg-red-500/20 text-red-500' : m.s === 'Completado' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/20 text-gray-400'}`}>{m.s}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
              <BookOpen size={18}/> Asignar Nuevo Curso
            </button>
          </div>
        );
      case 'Leaderboard':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="text-amber-500" /> Ranking de Agentes (Top Performers)
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { r: 1, n: 'Roberto Sánchez', ftds: 24, ret: '$54,000' },
                { r: 2, n: 'Elena Valdez', ftds: 18, ret: '$42,000' },
                { r: 3, n: 'Martín Gómez', ftds: 15, ret: '$12,500' }
              ].map((a) => (
                <div key={a.r} className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${a.r === 1 ? 'bg-amber-500 text-black shadow-[0_0_15px_#f59e0b]' : a.r === 2 ? 'bg-gray-300 text-black' : 'bg-orange-700 text-white'}`}>{a.r}</div>
                    <p className="font-bold text-lg text-white">{a.n}</p>
                  </div>
                  <div className="flex gap-8 text-right">
                    <div><p className="text-xs text-gray-500">FTDs</p><p className="font-bold text-emerald-400">{a.ftds}</p></div>
                    <div><p className="text-xs text-gray-500">Volumen</p><p className="font-bold text-blue-400">{a.ret}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'PIPs':
         return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Performance Improvement Plans
            </h3>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
              <p className="text-red-400 text-sm"><strong>Atención:</strong> Agentes con conversión inferior al 2% o 0 FTDs en 7 días son marcados automáticamente para intervención.</p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Agente</th><th className="py-3 px-4">Conversión</th><th className="py-3 px-4">Días en PIP</th><th className="py-3 px-4">Acciones</th></tr>
              </thead>
              <tbody>
                {[
                  { n: 'Diego L.', c: '0.5%', d: 'Día 5 de 7' },
                  { n: 'Carla F.', c: '1.1%', d: 'Día 2 de 7' }
                ].map((a, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{a.n}</td>
                    <td className="py-4 px-4 font-bold text-red-500">{a.c}</td>
                    <td className="py-4 px-4 text-orange-400 text-xs font-bold">{a.d}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Baja Sugerida</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Mapa de Calor':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="text-orange-500" /> Mapa de Calor de Conversión (Fuentes)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { f: 'Meta Ads (FB/IG)', c: '4.5%', l: 'Alta', col: 'text-emerald-500', bg: 'bg-emerald-500/20' },
                  { f: 'Google Search', c: '7.2%', l: 'Muy Alta', col: 'text-emerald-400', bg: 'bg-emerald-400/20' },
                  { f: 'Display / Native', c: '0.8%', l: 'Baja (Quema)', col: 'text-red-500', bg: 'bg-red-500/20' }
                ].map((s, i) => (
                  <div key={i} className="bg-black/30 p-6 rounded-xl border border-white/5 text-center flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-2">{s.f}</p>
                    <p className={`text-4xl font-black ${s.col} mb-3`}>{s.c}</p>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${s.bg} ${s.col}`}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          );
      case 'Control de Presencia':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-cyan-500" /> Tiempos Muertos y Pausas
              </h3>
              <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20 text-cyan-400 mb-6 text-sm">
                Agentes que han superado los 15 minutos en estado "Descanso" o inactivos.
              </div>
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                  <tr><th className="py-3 px-4">Agente</th><th className="py-3 px-4">Estado Actual</th><th className="py-3 px-4">Tiempo</th><th className="py-3 px-4">Acción</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 font-bold">Mateo V.</td>
                    <td className="py-4 px-4 text-amber-500 font-bold">Break (Comida)</td>
                    <td className="py-4 px-4 font-bold text-red-400">45:10 min</td>
                    <td className="py-4 px-4"><button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold transition-colors">Forzar Log-Out</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
      case 'Análisis de Objeciones':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-pink-500" /> Mapeo de Rechazos (Últimos 7 días)
              </h3>
              <div className="flex flex-col gap-6">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between mb-3"><p className="font-bold text-white text-lg">"No tengo dinero / Capital atascado"</p><p className="text-pink-400 font-bold text-lg">42%</p></div>
                  <div className="w-full bg-black rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full w-[42%] shadow-[0_0_10px_#ec4899]"></div></div>
                  <p className="text-sm text-gray-400 mt-3"><strong>Acción sugerida:</strong> Reforzar guión de financiamiento cruzado o depósitos mínimos fraccionados en el próximo training.</p>
                </div>
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between mb-3"><p className="font-bold text-white text-lg">"Estafa / Desconfianza"</p><p className="text-pink-400 font-bold text-lg">28%</p></div>
                  <div className="w-full bg-black rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full w-[28%] shadow-[0_0_10px_#ec4899]"></div></div>
                  <p className="text-sm text-gray-400 mt-3"><strong>Acción sugerida:</strong> Enviar dossier legal y regulación KYC inmediatamente durante la objeción.</p>
                </div>
              </div>
            </div>
          );
      case 'Simulador de Bonos':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="text-green-500" /> Simulador de Incentivos
              </h3>
              <div className="flex gap-4 mb-8">
                 <input type="number" placeholder="Bono extra por FTD ($)" className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 w-64" defaultValue="50" />
                 <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors">Proyectar Impacto</button>
              </div>
              <div className="bg-black/30 p-8 rounded-xl border border-white/5 text-center">
                <p className="text-gray-400 text-base mb-2">Impacto estimado en nómina (Semana actual)</p>
                <p className="text-5xl text-white font-mono font-black mb-3">$7,100 <span className="text-sm text-gray-500 font-sans font-normal ml-2">(142 FTDs proyectados x $50)</span></p>
                <button className="mt-6 px-8 py-3 bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold transition-all border border-white/20 hover:border-white/40">Autorizar Promo de Piso</button>
              </div>
            </div>
          );
      case 'Rescate de VIPs':
          return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <LifeBuoy className="text-rose-500" /> Intervención Anti-Churn (VIPs en Riesgo)
              </h3>
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6">
                <p className="text-rose-400 text-sm">Cuentas con Equity mayor a $10,000 que han solicitado retiro completo o tienen quejas abiertas.</p>
              </div>
              <div className="bg-black/30 p-6 rounded-xl border border-rose-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-bold text-white text-xl mb-1">Sr. Fernando Guzmán</p>
                  <p className="text-sm text-gray-400">Balance: <span className="font-mono text-emerald-400 font-bold">$45,000</span> | Agente actual: <span className="text-white font-bold">Pedro R.</span></p>
                  <p className="text-sm text-rose-400 mt-2 bg-rose-500/10 inline-block px-3 py-1 rounded-md">Motivo: "Mala gestión de riesgo en la última operativa."</p>
                </div>
                <button className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]">Tomar Llamada (SOS)</button>
              </div>
            </div>
          );
      default:
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center shadow-xl animate-fade-in">
            <BarChart size={56} className="text-gray-500 mx-auto mb-6 opacity-30" />
            <h3 className="text-2xl font-bold text-white mb-3">Módulo de Management</h3>
            <p className="text-gray-400 max-w-md mx-auto">Selecciona una herramienta operativa para analizar métricas o tomar acciones de impacto inmediato en el piso.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-500 font-bold mb-2 uppercase text-sm tracking-widest">
            <TrendingUp size={18} /> Dirección de Ventas & Capacitación
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Panel del Manager</h1>
          <p className="text-gray-400 mt-2">Garantiza el cumplimiento estricto de cuotas mediante análisis táctico, QA y entrenamiento de piso.</p>
        </div>
      </div>

      {/* 10 Tareas (Grid de Botones Interactivos) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="text-emerald-500" size={20} />
          Herramientas de Dirección (Selecciona una Acción)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {managerTasks.map((task, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTask(task.id)}
              className={`border rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-1 ${
                activeTask === task.id ? 'bg-white/10 border-emerald-500/50 scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${task.bg} ${task.color} group-hover:scale-110 transition-transform`}>
                {task.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{task.title}</h3>
              <p className="text-xs text-gray-400 leading-tight">{task.desc}</p>
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
