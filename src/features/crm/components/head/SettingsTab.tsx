import { Save, Shield, Clock, Gauge } from 'lucide-react';

export function SettingsTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* Metas Globales */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <Gauge size={18} className="text-amber-500" /> Metas Globales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Meta FTDs Diarios (por agente)</label>
            <input type="number" defaultValue={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Meta Retención Mensual (USD)</label>
            <input type="number" defaultValue={100000} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Meta Conversión Mínima (%)</label>
            <input type="number" defaultValue={2.5} step={0.1} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Depósito Mínimo (USD)</label>
            <input type="number" defaultValue={250} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 outline-none" />
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <Clock size={18} className="text-blue-500" /> Horarios de Operación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Zona Horaria</label>
            <select defaultValue="America/Mexico_City" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/Bogota">Bogotá (GMT-5)</option>
              <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Hora de Inicio</label>
            <input type="time" defaultValue="08:00" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Hora de Cierre</label>
            <input type="time" defaultValue="18:00" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
          </div>
        </div>
      </div>

      {/* Ajustes de riesgo */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <Shield size={18} className="text-rose-500" /> Ajustes de Riesgo (Clientes)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Apalancamiento Máximo</label>
            <select defaultValue="100" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none">
              <option value="50">1:50</option>
              <option value="100">1:100</option>
              <option value="200">1:200</option>
              <option value="500">1:500</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Nivel de Margin Call (%)</label>
            <input type="number" defaultValue={50} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">📋 Logs de Auditoría (Últimos)</h3>
        <div className="flex flex-col gap-2 text-sm">
          {[
            { action: 'Rol cambiado: Camila Herrera → SUSPENDIDO', by: 'Head Admin', time: 'Hace 2h' },
            { action: 'Lead L-007 reasignado a Pedro R.', by: 'Chief', time: 'Hace 3h' },
            { action: 'Depósito DP-093 aprobado ($2,500)', by: 'Chief', time: 'Hace 5h' },
            { action: 'Meta FTDs actualizada: 2 → 3 diarios', by: 'Head Admin', time: 'Ayer' },
            { action: 'Nuevo agente registrado: Jorge Díaz', by: 'Manager', time: 'Hace 2 días' },
          ].map((log, i) => (
            <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
              <div>
                <p className="text-white">{log.action}</p>
                <p className="text-xs text-gray-500">Por: {log.by}</p>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">{log.time}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="self-end bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2">
        <Save size={18} /> Guardar Configuración
      </button>
    </div>
  );
}
