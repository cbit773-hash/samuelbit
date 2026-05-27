import { X, Phone, Mail, MapPin, DollarSign, PhoneCall, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ClientProfileProps {
  lead: { id: string; name: string; phone: string; email: string; country: string; status: string; agent: string; created: string };
  onClose: () => void;
}

const MOCK_ACTIVITY: Record<string, { deposits: any[]; calls: any[]; notes: any[] }> = {
  'L-001': {
    deposits: [],
    calls: [{ date: '2026-04-30', type: 'Saliente', duration: '0:00', result: 'No contestó', agent: 'Sin asignar' }],
    notes: [{ date: '2026-04-30', text: 'Lead ingresado desde campaña Facebook Ads México', by: 'Sistema' }],
  },
  'L-002': {
    deposits: [],
    calls: [
      { date: '2026-04-29', type: 'Saliente', duration: '4:32', result: 'Interesado', agent: 'Ana M.' },
      { date: '2026-04-30', type: 'Saliente', duration: '2:15', result: 'Pidió más info', agent: 'Ana M.' },
    ],
    notes: [
      { date: '2026-04-29', text: 'Cliente interesado en Forex, tiene experiencia previa con otro bróker', by: 'Ana M.' },
      { date: '2026-04-30', text: 'Enviado PDF de condiciones de trading', by: 'Ana M.' },
    ],
  },
  'L-004': {
    deposits: [{ id: 'DP-098', amount: 500, type: 'FTD', status: 'Verificando', date: '2026-04-28' }],
    calls: [
      { date: '2026-04-27', type: 'Saliente', duration: '8:45', result: 'Interesado', agent: 'Laura G.' },
      { date: '2026-04-28', type: 'Entrante', duration: '12:30', result: 'Quiere depositar', agent: 'Laura G.' },
      { date: '2026-04-29', type: 'Saliente', duration: '3:10', result: 'Confirmó depósito', agent: 'Laura G.' },
    ],
    notes: [
      { date: '2026-04-27', text: 'Empresario argentino, busca diversificar portafolio. Interés en índices US.', by: 'Laura G.' },
      { date: '2026-04-28', text: 'Solicitó información de apalancamiento y spreads en US30', by: 'Laura G.' },
      { date: '2026-04-29', text: 'Depósito de $500 en proceso de verificación', by: 'Sistema' },
    ],
  },
  'L-006': {
    deposits: [
      { id: 'DP-080', amount: 1000, type: 'FTD', status: 'Aprobado', date: '2026-04-21' },
      { id: 'DP-088', amount: 2500, type: 'RETENCION', status: 'Aprobado', date: '2026-04-28' },
    ],
    calls: [
      { date: '2026-04-20', type: 'Saliente', duration: '15:20', result: 'Cierre FTD', agent: 'Pedro R.' },
      { date: '2026-04-25', type: 'Saliente', duration: '8:00', result: 'Retención exitosa', agent: 'Pedro R.' },
    ],
    notes: [
      { date: '2026-04-20', text: 'Cierre exitoso. Cliente con capital disponible. Perfil: retención alta.', by: 'Pedro R.' },
      { date: '2026-04-25', text: 'Retención de $2,500 confirmada. Cliente satisfecho con operaciones.', by: 'Pedro R.' },
    ],
  },
};

const DEFAULT_ACTIVITY = {
  deposits: [],
  calls: [{ date: '—', type: 'Saliente', duration: '0:00', result: 'Sin actividad', agent: '—' }],
  notes: [{ date: '—', text: 'Sin notas registradas aún.', by: 'Sistema' }],
};

export function ClientProfile({ lead, onClose }: ClientProfileProps) {
  const activity = MOCK_ACTIVITY[lead.id] || DEFAULT_ACTIVITY;
  const totalDeposited = activity.deposits.reduce((s: number, d: any) => s + d.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right-10 duration-300"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">{lead.id}</p>
              <h2 className="text-2xl font-black text-white">{lead.name}</h2>
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Phone size={12} />{lead.phone}</span>
                <span className="flex items-center gap-1"><Mail size={12} />{lead.email}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{lead.country}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"><X size={20} /></button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">${totalDeposited.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-semibold">Depositado</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-blue-400">{activity.calls.length}</p>
              <p className="text-[10px] text-gray-500 font-semibold">Llamadas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-400">{activity.notes.length}</p>
              <p className="text-[10px] text-gray-500 font-semibold">Notas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-300">{lead.agent}</p>
              <p className="text-[10px] text-gray-500 font-semibold">Agente</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Depósitos */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" />
              <h3 className="text-white font-bold">Depósitos ({activity.deposits.length})</h3>
            </div>
            {activity.deposits.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Sin depósitos registrados.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {activity.deposits.map((d: any, i: number) => (
                  <div key={i} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">${d.amount.toLocaleString()} <span className="text-xs text-gray-500">USD</span></p>
                      <p className="text-xs text-gray-500">{d.id} · {d.type} · {d.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      d.status === 'Aprobado' ? 'bg-emerald-500/20 text-emerald-400' :
                      d.status === 'Rechazado' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>{d.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Llamadas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <PhoneCall size={16} className="text-blue-500" />
              <h3 className="text-white font-bold">Historial de Llamadas ({activity.calls.length})</h3>
            </div>
            <div className="divide-y divide-white/5">
              {activity.calls.map((c: any, i: number) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${c.type === 'Entrante' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                      {c.type === 'Entrante' ? <ArrowDownRight size={14} className="text-emerald-400" /> : <ArrowUpRight size={14} className="text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{c.type} · {c.duration}</p>
                      <p className="text-xs text-gray-500">{c.date} · {c.agent}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{c.result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <FileText size={16} className="text-purple-500" />
              <h3 className="text-white font-bold">Notas del Agente ({activity.notes.length})</h3>
            </div>
            <div className="divide-y divide-white/5">
              {activity.notes.map((n: any, i: number) => (
                <div key={i} className="p-4">
                  <p className="text-white text-sm">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.date} — {n.by}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
