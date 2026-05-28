import { Navigate, useSearchParams } from 'react-router-dom';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { DEFAULT_ACCOUNT_TAB, isValidAccountTab } from '../config/account-tabs';

/** Preserva ?tab= al migrar /dashboard/client → /dashboard/account */
export function LegacyClientRedirect() {
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const tab = isValidAccountTab(rawTab) ? rawTab : DEFAULT_ACCOUNT_TAB;
  const deposit = searchParams.get('deposit');
  const next = deposit
    ? `${CLIENT_PATHS.accountTab(tab)}&deposit=${deposit}`
    : CLIENT_PATHS.accountTab(tab);
  return <Navigate to={next} replace />;
}
