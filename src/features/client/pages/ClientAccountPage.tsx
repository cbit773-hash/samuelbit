import { Activity, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClientData } from '../context/ClientDataContext';
import {
  CLIENT_ACCOUNT_TABS,
  DEFAULT_ACCOUNT_TAB,
  WALLET_DEPENDENT_TABS,
  isValidAccountTab,
  type ClientAccountTabId,
} from '../config/account-tabs';
import { WalletErrorBanner } from '../components/WalletErrorBanner';
import { WalletTabSkeleton } from '../components/WalletTabSkeleton';
import { type ActionMessage } from '../components/ActionBanner';
import { formatUsd } from '../../wallet/utils/format-usd';
import { AccountSummaryTab } from '../tabs/AccountSummaryTab';
import { DepositTab } from '../tabs/DepositTab';
import { WithdrawTab } from '../tabs/WithdrawTab';
import { TransactionsTab } from '../tabs/TransactionsTab';
import { PortfolioTab } from '../tabs/PortfolioTab';
import { NotificationsTab } from '../tabs/NotificationsTab';
import { SecurityKycTab } from '../tabs/SecurityKycTab';
import { ProfileTab } from '../tabs/ProfileTab';

export function ClientAccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    wallet,
    walletLoading,
    walletError,
    refreshAll,
    refreshWallet,
  } = useClientData();

  const [actionMessage, setActionMessage] = useState<ActionMessage>(null);

  const rawTab = searchParams.get('tab');
  const activeTab: ClientAccountTabId = isValidAccountTab(rawTab) ? rawTab : DEFAULT_ACCOUNT_TAB;
  const tabMeta = CLIENT_ACCOUNT_TABS[activeTab];

  useEffect(() => {
    if (!isValidAccountTab(rawTab)) {
      setSearchParams({ tab: DEFAULT_ACCOUNT_TAB }, { replace: true });
    }
  }, [rawTab, setSearchParams]);

  useEffect(() => {
    const depositResult = searchParams.get('deposit');
    if (depositResult === 'success') {
      setActionMessage({
        type: 'success',
        text: 'Pago enviado. Tu saldo se actualizará cuando NOWPayments confirme la transacción.',
      });
      void refreshAll();
      setSearchParams({ tab: 'depositar' }, { replace: true });
    }
    if (depositResult === 'cancelled') {
      setActionMessage({ type: 'error', text: 'Depósito cancelado.' });
      setSearchParams({ tab: 'depositar' }, { replace: true });
    }
  }, [searchParams, refreshAll, setSearchParams]);

  const balance = wallet?.balance ?? 0;
  const needsWallet = WALLET_DEPENDENT_TABS.includes(activeTab);

  const renderTab = () => {
    if (needsWallet && walletLoading) {
      return <WalletTabSkeleton />;
    }
    if (needsWallet && walletError) {
      return (
        <WalletErrorBanner message={walletError} onRetry={() => void refreshWallet()} />
      );
    }

    switch (activeTab) {
      case 'resumen':
        return <AccountSummaryTab />;
      case 'depositar':
        return (
          <DepositTab actionMessage={actionMessage} onActionMessage={setActionMessage} />
        );
      case 'retirar':
        return (
          <WithdrawTab actionMessage={actionMessage} onActionMessage={setActionMessage} />
        );
      case 'historial':
        return <TransactionsTab />;
      case 'portafolio':
        return <PortfolioTab />;
      case 'notificaciones':
        return <NotificationsTab />;
      case 'seguridad':
        return <SecurityKycTab />;
      case 'perfil':
        return <ProfileTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Activity className="text-brand" /> {tabMeta.label}
          </h1>
          <p className="text-muted mt-2">
            {tabMeta.description}
            {!walletLoading && (activeTab === 'resumen' || activeTab === 'depositar' || activeTab === 'retirar') && (
              <span className="text-cyan-400 font-bold ml-2">
                Balance real: {formatUsd(balance)}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshAll()}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      <div className="min-h-[450px]">{renderTab()}</div>
    </div>
  );
}
