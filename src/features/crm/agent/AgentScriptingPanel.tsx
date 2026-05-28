import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { OBJECTION_SCRIPTS, renderScript } from './objection-scripts';

export function AgentScriptingPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const [activeId, setActiveId] = useState(OBJECTION_SCRIPTS[0]?.id ?? '');
  const script = OBJECTION_SCRIPTS.find((s) => s.id === activeId);
  const text = crm.currentLead && script
    ? renderScript(script.template, crm.currentLead.first_name, crm.currentLead.interest ?? 'nuestros mercados')
    : 'Abre Auto-Dialer para cargar el guión contextual.';

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-purple-500 mb-6 flex items-center gap-2">
        <MessageSquare /> Teleprompter de Objeciones
      </h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {OBJECTION_SCRIPTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${
              activeId === s.id
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-surface-inset border-border text-muted'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="bg-surface-inset border border-purple-500/30 p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
        <p className="text-muted text-sm mb-4 font-bold uppercase">Guión:</p>
        <p className="text-foreground text-xl leading-relaxed font-light">{text}</p>
      </div>
    </div>
  );
}
