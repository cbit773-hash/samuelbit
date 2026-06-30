import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, Users, FileText, UserCircle } from 'lucide-react';
import { OverviewTab } from '../components/head/OverviewTab';
import { PersonnelTab } from '../components/head/PersonnelTab';
import { LeadsTab } from '../components/head/LeadsTab';
import { ClientsTab } from '../components/head/ClientsTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Crown },
  { id: 'clientes', label: 'Clientes', icon: UserCircle },
  { id: 'leads', label: 'Leads', icon: FileText },
  { id: 'personnel', label: 'Personal', icon: Users },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function HeadDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabFromUrl && TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'overview',
  );

  useEffect(() => {
    const urlTab = searchParams.get('tab') as TabId | null;
    if (urlTab && TABS.some((t) => t.id === urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      <div className="border-b border-cyan-500/10 pb-4">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-1 uppercase text-[10px] tracking-[0.2em]">
          <Crown size={14} /> Centro de Comando
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Panel Head — <span className="text-cyan-400">CRM Lite</span>
        </h1>
      </div>

      <div className="flex gap-1 bg-surface border border-cyan-500/10 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-muted hover:text-foreground hover:bg-surface-inset border border-transparent'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'clientes' && <ClientsTab />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'personnel' && <PersonnelTab />}
      </div>
    </div>
  );
}
