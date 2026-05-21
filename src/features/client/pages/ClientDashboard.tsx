import { 
  LayoutDashboard, TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle,
  LineChart, History, Bell, Shield, HelpCircle, DollarSign, Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function ClientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState('Resumen');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'resumen') setActiveTask('Resumen');
    if (tab === 'depositar') setActiveTask('Depositar');
    if (tab === 'retirar') setActiveTask('Retirar');
    if (tab === 'historial') setActiveTask('Historial');
  }, [searchParams]);

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    const tabMap: Record<string, string> = { 'Resumen': 'resumen', 'Depositar': 'depositar', 'Retirar': 'retirar', 'Historial': 'historial' };
    setSearchParams(tabMap[taskId] ? { tab: tabMap[taskId] } : {});
  };

  const clientTasks = [
    { id: 'Resumen', icon: <LayoutDashboard size={20} />, title: "Resumen", desc: "Balance y equidad.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'Portafolio', icon: <TrendingUp size={20} />, title: "Portafolio", desc: "Posiciones abiertas.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 'Depositar', icon: <ArrowUpCircle size={20} />, title: "Depositar", desc: "Añadir fondos.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: 'Retirar', icon: <ArrowDownCircle size={20} />, title: "Retirar", desc: "Solicitar retiro.", color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 'Historial', icon: <History size={20} />, title: "Historial", desc: "Movimientos.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'Rendimiento', icon: <LineChart size={20} />, title: "Rendimiento", desc: "Gráficas de PnL.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: 'Billetera', icon: <Wallet size={20} />, title: "Billetera Web3", desc: "Activos crypto.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'Notificaciones', icon: <Bell size={20} />, title: "Alertas", desc: "Avisos del broker.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 'Seguridad', icon: <Shield size={20} />, title: "Seguridad", desc: "KYC y 2FA.", color: "text-gray-400", bg: "bg-gray-400/10" },
    { id: 'Soporte', icon: <HelpCircle size={20} />, title: "Soporte", desc: "Chat con asesor.", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  const renderContent = () => {
    switch(activeTask) {
      case 'Resumen':
        return (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Balance Total</p>
                <p className="text-5xl font-black text-white font-mono relative z-10">$10,000<span className="text-2xl text-gray-500">.00</span></p>
                <p className="text-blue-500 text-xs mt-3 font-bold">USD | Cuenta Live #MT5-88421</p>
              </div>
              <div className="bg-white/5 border border-emerald-500/20 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Equidad (Equity)</p>
                <p className="text-5xl font-black text-emerald-500 font-mono relative z-10">$10,450<span className="text-2xl text-emerald-700">.20</span></p>
                <p className="text-emerald-500/50 text-xs mt-3 font-bold">PnL Flotante: +$450.20</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                <p className="text-gray-400 text-sm font-semibold mb-2">Margen Libre</p>
                <p className="text-5xl font-black text-white font-mono">$9,800<span className="text-2xl text-gray-500">.00</span></p>
                <p className="text-gray-500 text-xs mt-3 font-bold">Nivel de Margen: 522%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">Posiciones Abiertas</p>
                <p className="text-3xl font-black text-white">3</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">Ganancia Hoy</p>
                <p className="text-3xl font-black text-emerald-500">+$125</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">Total Depositado</p>
                <p className="text-3xl font-black text-white">$10k</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
                <p className="text-gray-400 text-xs font-bold mb-1">Total Retirado</p>
                <p className="text-3xl font-black text-white">$0</p>
              </div>
            </div>
          </div>
        );
      case 'Portafolio':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" /> Posiciones Abiertas
            </h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
                <tr><th className="py-3 px-4">Instrumento</th><th className="py-3 px-4">Tipo</th><th className="py-3 px-4">Volumen</th><th className="py-3 px-4">Apertura</th><th className="py-3 px-4">Actual</th><th className="py-3 px-4">PnL</th></tr>
              </thead>
              <tbody>
                {[
                  { i: 'BTC/USD', t: 'BUY', v: '0.1 Lot', a: '$67,200', c: '$68,450', p: '+$125.00', col: 'text-emerald-500' },
                  { i: 'EUR/USD', t: 'SELL', v: '0.5 Lot', a: '1.0820', c: '1.0795', p: '+$125.00', col: 'text-emerald-500' },
                  { i: 'GOLD', t: 'BUY', v: '0.2 Lot', a: '$2,340', c: '$2,355', p: '+$300.00', col: 'text-emerald-500' },
                ].map((p, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold text-white">{p.i}</td>
                    <td className="py-4 px-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.t === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{p.t}</span></td>
                    <td className="py-4 px-4 font-mono text-gray-400">{p.v}</td>
                    <td className="py-4 px-4 font-mono text-gray-400">{p.a}</td>
                    <td className="py-4 px-4 font-mono text-white">{p.c}</td>
                    <td className={`py-4 px-4 font-mono font-bold ${p.col}`}>{p.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Depositar':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
              <ArrowUpCircle /> Depositar Fondos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                <DollarSign size={40} className="text-blue-500 mb-4" />
                <p className="text-white font-bold text-lg">Tarjeta de Crédito / Débito</p>
                <p className="text-gray-400 text-sm mt-1">Visa, Mastercard, AMEX. Proceso inmediato.</p>
                <div className="mt-4">
                  <input type="number" placeholder="Monto USD" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-mono outline-none focus:border-cyan-500" />
                  <button className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">Procesar Depósito</button>
                </div>
              </div>
              <div className="bg-black/30 border border-white/5 p-6 rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-black text-black text-lg mb-4">₿</div>
                <p className="text-white font-bold text-lg">Criptomonedas</p>
                <p className="text-gray-400 text-sm mt-1">USDT (TRC20/ERC20), Bitcoin, Ethereum.</p>
                <div className="mt-4 bg-black border border-white/20 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-xs mb-2">Dirección USDT (TRC20)</p>
                  <p className="text-amber-500 font-mono text-sm break-all">TKz3x9...v8yPq</p>
                  <button className="mt-3 bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2 rounded-lg">Copiar Dirección</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Retirar':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
              <ArrowDownCircle /> Solicitar Retiro
            </h3>
            <div className="bg-black/30 border border-white/5 p-6 rounded-xl max-w-lg mx-auto">
              <p className="text-gray-400 text-sm mb-4">Disponible para retiro: <span className="text-white font-bold">$9,800.00</span></p>
              <input type="number" placeholder="Monto a retirar" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-mono outline-none focus:border-amber-500 mb-4" />
              <select className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-amber-500 mb-4">
                <option>Método: Transferencia Bancaria</option>
                <option>Método: USDT (TRC20)</option>
                <option>Método: Bitcoin</option>
              </select>
              <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">Enviar Solicitud de Retiro</button>
              <p className="text-gray-500 text-xs mt-3 text-center">Los retiros son procesados en un plazo de 24-48 horas hábiles.</p>
            </div>
          </div>
        );
      case 'Historial':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-purple-500 mb-6 flex items-center gap-2">
              <History /> Historial de Movimientos
            </h3>
            <div className="space-y-3">
              {[
                { t: 'Depósito', m: '+$5,000', d: '2026-05-01', s: 'Aprobado', col: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { t: 'Depósito', m: '+$5,000', d: '2026-04-15', s: 'Aprobado', col: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { t: 'Retiro', m: '-$0', d: '--', s: 'Sin retiros', col: 'text-gray-500', bg: 'bg-gray-500/10' },
              ].map((tx, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${tx.bg} flex items-center justify-center`}>
                      {tx.t === 'Depósito' ? <ArrowUpCircle size={18} className={tx.col} /> : <ArrowDownCircle size={18} className={tx.col} />}
                    </div>
                    <div>
                      <p className="text-white font-bold">{tx.t}</p>
                      <p className="text-gray-500 text-xs">{tx.d}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${tx.col}`}>{tx.m}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.bg} ${tx.col}`}>{tx.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Rendimiento':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-indigo-500 mb-6 flex items-center gap-2">
              <LineChart /> Rendimiento de la Cuenta
            </h3>
            <div className="bg-black/30 p-8 rounded-xl border border-white/5 text-center">
              <div className="h-48 flex items-end justify-center gap-2">
                {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 rounded-t ${h > 60 ? 'bg-emerald-500' : h > 40 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ height: `${h * 1.8}px` }}></div>
                    <span className="text-[9px] text-gray-500">{['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-emerald-500 font-bold mt-6">Rendimiento acumulado: +4.5% (YTD)</p>
            </div>
          </div>
        );
      case 'Billetera':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
              <Wallet /> Billetera Web3
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { c: 'USDT', b: '2,500.00', usd: '$2,500', icon: '💵' },
                { c: 'BTC', b: '0.0150', usd: '$1,025', icon: '₿' },
                { c: 'ETH', b: '0.800', usd: '$2,960', icon: 'Ξ' },
              ].map((w, i) => (
                <div key={i} className="bg-black/30 border border-white/5 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{w.icon}</span>
                    <p className="text-white font-bold text-lg">{w.c}</p>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">{w.b}</p>
                  <p className="text-gray-400 text-sm mt-1">≈ {w.usd}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Notificaciones':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
              <Bell /> Notificaciones
            </h3>
            <div className="space-y-3">
              <div className="bg-emerald-500/10 border border-l-4 border-l-emerald-500 border-emerald-500/20 p-4 rounded-xl">
                <p className="text-white font-bold">✅ Depósito aprobado: $5,000</p>
                <p className="text-gray-400 text-xs mt-1">Hace 3 días</p>
              </div>
              <div className="bg-blue-500/10 border border-l-4 border-l-blue-500 border-blue-500/20 p-4 rounded-xl">
                <p className="text-white font-bold">📊 Tu posición en GOLD está en +$300</p>
                <p className="text-gray-400 text-xs mt-1">Hace 2 horas</p>
              </div>
              <div className="bg-amber-500/10 border border-l-4 border-l-amber-500 border-amber-500/20 p-4 rounded-xl">
                <p className="text-white font-bold">⚠️ Tu asesor quiere contactarte</p>
                <p className="text-gray-400 text-xs mt-1">Hace 30 minutos</p>
              </div>
            </div>
          </div>
        );
      case 'Seguridad':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
              <Shield /> Seguridad de la Cuenta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">Verificación KYC</p>
                  <p className="text-emerald-400 text-sm">Estado: Verificado ✓</p>
                </div>
                <Shield className="text-emerald-500" />
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">Autenticación 2FA</p>
                  <p className="text-amber-400 text-sm">Estado: Desactivado</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm">Activar</button>
              </div>
            </div>
          </div>
        );
      case 'Soporte':
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-pink-500 mb-6 flex items-center gap-2">
              <HelpCircle /> Soporte y Chat con Asesor
            </h3>
            <div className="bg-black/30 border border-white/5 p-6 rounded-xl max-w-lg mx-auto">
              <div className="bg-blue-500/10 p-4 rounded-xl mb-4">
                <p className="text-white font-bold">Tu asesor asignado:</p>
                <p className="text-blue-400 font-bold text-lg mt-1">Ana Martínez | Ext. 4521</p>
              </div>
              <textarea className="w-full bg-black border border-white/20 rounded-lg p-4 text-white h-28 resize-none" placeholder="Escribe tu consulta aquí..." />
              <button className="w-full mt-3 bg-pink-600 hover:bg-pink-500 text-white font-black py-3 rounded-lg transition-colors">Enviar Mensaje</button>
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
             <Activity className="text-blue-500" /> Mi Cuenta de Inversión
          </h1>
          <p className="text-gray-400 mt-2">Bienvenido a InvestPRO. Gestiona tu portafolio, deposita fondos y monitorea tu rendimiento.</p>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {clientTasks.map((task, i) => (
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
