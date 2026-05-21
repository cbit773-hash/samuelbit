import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, Users, FileText, DollarSign, BarChart, Settings, ShieldAlert } from 'lucide-react';
import { OverviewTab } from '../components/head/OverviewTab';
import { PersonnelTab } from '../components/head/PersonnelTab';
import { LeadsTab } from '../components/head/LeadsTab';
import { DepositsTab } from '../components/head/DepositsTab';
import { PerformanceTab } from '../components/head/PerformanceTab';
import { SettingsTab } from '../components/head/SettingsTab';
import { FraudTab } from '../components/head/FraudTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Crown, color: 'text-amber-500' },
  { id: 'personnel', label: 'Personal', icon: Users, color: 'text-blue-500' },
  { id: 'leads', label: 'CRM & Leads', icon: FileText, color: 'text-emerald-500' },
  { id: 'deposits', label: 'Depósitos', icon: DollarSign, color: 'text-green-500' },
  { id: 'performance', label: 'Mesas', icon: BarChart, color: 'text-purple-500' },
  { id: 'fraud', label: 'Anti-Fraude', icon: ShieldAlert, color: 'text-rose-500' },
  { id: 'settings', label: 'Config', icon: Settings, color: 'text-gray-400' },
] as const;

type TabId = typeof TABS[number]['id'];

export function HeadDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(tabFromUrl && TABS.some(t => t.id === tabFromUrl) ? tabFromUrl : 'overview');

  // Sync tab when URL changes (sidebar clicks)
  useEffect(() => {
    const urlTab = searchParams.get('tab') as TabId | null;
    if (urlTab && TABS.some(t => t.id === urlTab)) {
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
          <Crown size={14} /> Master Control Center
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Panel Head — <span className="text-cyan-400">Control Total</span></h1>
      </div>

      <div className="flex gap-1 bg-[#060d14] border border-cyan-500/10 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'personnel' && <PersonnelTab />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'deposits' && <DepositsTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'fraud' && <FraudTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
