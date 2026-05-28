import { PhoneCall } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName } from '../shared/crm-utils';

export function AgentQueueSidebar({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <div className="bg-surface-alt border border-border p-4 rounded-xl">
        <p className="text-muted text-xs font-bold uppercase mb-2">Siguiente en cola</p>
        {crm.nextInQueue ? (
          <>
            <p className="text-foreground font-bold">{leadName(crm.nextInQueue)}</p>
            <p className="text-muted text-sm">{crm.nextInQueue.phone}</p>
          </>
        ) : (
          <p className="text-muted text-sm">—</p>
        )}
      </div>
      <div className="bg-surface-alt border border-border p-4 rounded-xl flex-1 flex items-center justify-center">
        <button
          type="button"
          onClick={crm.goToNextLead}
          disabled={!crm.dialerQueue.length}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-foreground font-black rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <PhoneCall size={20} /> Siguiente Lead
        </button>
      </div>
    </div>
  );
}
