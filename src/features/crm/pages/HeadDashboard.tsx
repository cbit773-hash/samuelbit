import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OverviewTab } from '../components/head/OverviewTab';
import { PersonnelTab } from '../components/head/PersonnelTab';
import { LeadsTab } from '../components/head/LeadsTab';
import { ClientsTab } from '../components/head/ClientsTab';
import { WebRegistrationsTab } from '../components/head/WebRegistrationsTab';
import { DepositsTab } from '../components/head/DepositsTab';
import { PerformanceTab } from '../components/head/PerformanceTab';
import { FraudTab } from '../components/head/FraudTab';
import { SettingsTab } from '../components/head/SettingsTab';
import {
  DEFAULT_HEAD_TAB,
  getHeadTabMeta,
  isValidHeadTab,
  type HeadTabId,
} from '../config/head-tabs.config';

export function HeadDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab: HeadTabId = isValidHeadTab(rawTab) ? rawTab : DEFAULT_HEAD_TAB;
  const tabMeta = getHeadTabMeta(activeTab);
  const TabIcon = tabMeta.icon;

  useEffect(() => {
    if (!isValidHeadTab(rawTab)) {
      setSearchParams({ tab: DEFAULT_HEAD_TAB }, { replace: true });
    }
  }, [rawTab, setSearchParams]);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'clientes':
        return <ClientsTab />;
      case 'leads':
        return <LeadsTab />;
      case 'personnel':
        return <PersonnelTab />;
      case 'web-registrations':
        return <WebRegistrationsTab />;
      case 'deposits':
        return <DepositsTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'fraud':
        return <FraudTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-[1600px] mx-auto pb-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          <TabIcon className="text-brand shrink-0" size={28} />
          {tabMeta.label}
        </h1>
        <p className="text-muted mt-2">{tabMeta.description}</p>
      </div>

      <div className="min-h-[500px]">{renderTab()}</div>
    </div>
  );
}
