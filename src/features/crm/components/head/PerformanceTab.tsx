import { Trophy, TrendingUp, Users } from 'lucide-react';

const teams = [
  {
    name: 'Mesa Alpha', manager: 'María López (Floor Mgr.)', agents: 4,
    leads: 450, ftds: 12, conversion: '2.6%', retention: '$15,000', rank: 2,
    members: [
      { name: 'Ana Martínez', ftds: 5, leads: 120, rate: '4.2%' },
      { name: 'Pedro Ruiz', ftds: 4, leads: 130, rate: '3.1%' },
      { name: 'Diego Torres (TL)', ftds: 2, leads: 100, rate: '2.0%' },
      { name: 'Carlos López', ftds: 1, leads: 100, rate: '1.0%' },
    ]
  },
  {
    name: 'Mesa Beta', manager: 'María López (Floor Mgr.)', agents: 3,
    leads: 380, ftds: 8, conversion: '2.1%', retention: '$8,500', rank: 3,
    members: [
      { name: 'Laura García', ftds: 4, leads: 140, rate: '2.9%' },
      { name: 'Sofía Reyes', ftds: 3, leads: 120, rate: '2.5%' },
      { name: 'Jorge Díaz', ftds: 1, leads: 120, rate: '0.8%' },
    ]
  },
  {
    name: 'Mesa Gamma', manager: 'Roberto Sánchez (Mgr.)', agents: 5,
    leads: 520, ftds: 18, conversion: '3.4%', retention: '$32,000', rank: 1,
    members: [
      { name: 'Valentina Cruz', ftds: 6, leads: 120, rate: '5.0%' },
      { name: 'Mateo Herrera', ftds: 5, leads: 100, rate: '5.0%' },
      { name: 'Isabella Mora', ftds: 4, leads: 110, rate: '3.6%' },
      { name: 'Santiago Ríos', ftds: 2, leads: 100, rate: '2.0%' },
      { name: 'Camila Vargas', ftds: 1, leads: 90, rate: '1.1%' },
    ]
  },
];

export function PerformanceTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Ranking header */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
        <Trophy className="text-amber-500" size={24} />
        <div>
          <p className="text-amber-500 font-bold">🏆 Mejor Mesa del Mes: Mesa Gamma</p>
          <p className="text-gray-400 text-sm">18 FTDs | 3.4% conversión | $32,000 retención</p>
        </div>
      </div>

      {/* Mesas */}
      {teams.sort((a, b) => a.rank - b.rank).map((team, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                <Users size={16} className={i === 0 ? 'text-amber-500' : 'text-gray-400'} />
                {team.name}
                {i === 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">TOP</span>}
              </h3>
              <p className="text-gray-400 text-xs mt-1">{team.manager} · {team.agents} agentes</p>
            </div>
            <div className="flex gap-6 text-center">
              <div><p className="text-lg font-bold text-white">{team.leads}</p><p className="text-[10px] text-gray-500">Leads</p></div>
              <div><p className="text-lg font-bold text-emerald-500">{team.ftds}</p><p className="text-[10px] text-gray-500">FTDs</p></div>
              <div><p className="text-lg font-bold text-blue-400">{team.retention}</p><p className="text-[10px] text-gray-500">Retención</p></div>
              <div><p className="text-lg font-bold text-purple-400">{team.conversion}</p><p className="text-[10px] text-gray-500">Conv.</p></div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
              <tr>
                <th className="px-4 py-2 text-left">Agente</th>
                <th className="px-4 py-2 text-left">FTDs</th>
                <th className="px-4 py-2 text-left">Leads</th>
                <th className="px-4 py-2 text-left">Conversión</th>
              </tr>
            </thead>
            <tbody>
              {team.members.map((m, j) => (
                <tr key={j} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2 text-white font-semibold">{m.name}</td>
                  <td className="px-4 py-2 font-mono text-emerald-500 font-bold">{m.ftds}</td>
                  <td className="px-4 py-2 font-mono text-gray-300">{m.leads}</td>
                  <td className="px-4 py-2 font-mono text-gray-300">{m.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
