import { PhoneCall, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAgentCrm } from '../hooks/useAgentCrm';
import { CrmConnectionBanner } from '../layout/CrmConnectionBanner';
import { CrmTaskGrid } from '../layout/CrmTaskGrid';
import { AGENT_TASKS } from './agent-tasks.config';
import { taskFromTab, tabFromTask } from '../shared/agent-tab-map';
import { AgentDialerPanel } from './AgentDialerPanel';
import { AgentFtdPanel } from './AgentFtdPanel';
import { AgentCallbacksPanel } from './AgentCallbacksPanel';
import { AgentCrmNotesPanel } from './AgentCrmNotesPanel';
import { AgentLeadsListPanel } from './AgentLeadsListPanel';
import { AgentScriptingPanel } from './AgentScriptingPanel';
import { AgentSosPanel } from './AgentSosPanel';
import { AgentQuickPayPanel } from './AgentQuickPayPanel';
import { AgentRankingPanel } from './AgentRankingPanel';
import { AgentKycLegalPanel } from './AgentKycLegalPanel';
import { AgentPresencePanel } from './AgentPresencePanel';

export function AgentDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTask, setActiveTask] = useState(() => taskFromTab(searchParams.get('tab')));
  const crm = useAgentCrm();

  useEffect(() => {
    setActiveTask(taskFromTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
    const tab = tabFromTask(taskId);
    if (tab) setSearchParams({ tab });
    else setSearchParams({});
  };

  const goToDialerWithLead = useCallback(
    (leadId: string) => {
      const idx = crm.dialerQueue.findIndex((l) => l.id === leadId);
      if (idx >= 0) crm.setCurrentIndex(idx);
      else {
        const sortedIdx = crm.sortedLeads.findIndex((l) => l.id === leadId);
        if (sortedIdx >= 0) crm.setCurrentIndex(Math.min(sortedIdx, crm.dialerQueue.length - 1));
      }
      handleTaskChange('Auto-Dialer');
    },
    [crm],
  );

  const renderContent = () => {
    switch (activeTask) {
      case 'Auto-Dialer':
        return <AgentDialerPanel crm={crm} />;
      case 'Mis Ventas (FTD)':
        return <AgentFtdPanel crm={crm} />;
      case 'Mis Leads':
        return <AgentLeadsListPanel crm={crm} onSelectLead={goToDialerWithLead} />;
      case 'Callbacks':
        return <AgentCallbacksPanel crm={crm} onGoDialer={goToDialerWithLead} />;
      case 'CRM Notas':
        return <AgentCrmNotesPanel crm={crm} />;
      case 'Scripting':
        return <AgentScriptingPanel crm={crm} />;
      case 'Botón SOS':
        return <AgentSosPanel crm={crm} />;
      case 'Cobro Rápido':
        return <AgentQuickPayPanel crm={crm} />;
      case 'Ranking':
        return <AgentRankingPanel />;
      case 'KYC & Legal':
        return <AgentKycLegalPanel crm={crm} />;
      case 'Estado Laboral':
        return <AgentPresencePanel />;
      default:
        return <AgentDialerPanel crm={crm} />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <PhoneCall className="text-cyan-500" /> Estación de Ventas (Closer)
          </h1>
          <p className="text-muted mt-2">
            Leads y depósitos conectados a Supabase · RLS por agente asignado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => crm.refresh()}
          className="text-xs text-muted hover:text-foreground flex items-center gap-1"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      <CrmTaskGrid tasks={AGENT_TASKS} activeTask={activeTask} onTaskChange={handleTaskChange} />

      <div className="min-h-[450px]">
        <CrmConnectionBanner crm={crm} />
        {renderContent()}
      </div>
    </div>
  );
}
