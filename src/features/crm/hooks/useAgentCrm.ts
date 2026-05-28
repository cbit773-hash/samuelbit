import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMyLeads,
  getMyLeadStats,
  getDialerQueue,
  updateMyLead,
  sortLeadsForDialer,
} from '../../../core/supabase/services/leads.service';
import { getCurrentAgentId } from '../../../core/supabase/services/leads.service';
import { getDepositsByAgent } from '../../../core/supabase/services/deposits.service';
import { getMyCallbacks } from '../../../core/supabase/services/agent-closer.service';
import type { Lead, LeadCallback, LeadStatus } from '../../../core/supabase/database.types';
import type { Deposit } from '../../../core/supabase/database.types';
import { useAuthStore } from '../../auth/store/auth.store';
import { isDemoUserId } from '../../../core/supabase/demo-ids';

export function useAgentCrm() {
  const user = useAuthStore((s) => s.user);
  const isDemo = isDemoUserId(user?.id);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    nuevo: 0,
    enProceso: 0,
    ftd: 0,
    descartado: 0,
    callbacks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [scheduledCallbacks, setScheduledCallbacks] = useState<LeadCallback[]>([]);

  const refresh = useCallback(async () => {
    if (isDemo) {
      setLoading(false);
      setError('Inicia sesión real como agent@investpro.com para cargar tus leads desde Supabase.');
      setLeads([]);
      setDeposits([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const agentId = await getCurrentAgentId();
      const [myLeads, leadStats, myDeposits, callbacks] = await Promise.all([
        getMyLeads(),
        getMyLeadStats(),
        agentId ? getDepositsByAgent(agentId) : Promise.resolve([]),
        getMyCallbacks(),
      ]);
      setLeads(myLeads);
      setStats({
        ...leadStats,
        callbacks: callbacks.length || leadStats.callbacks,
      });
      setDeposits(myDeposits);
      setScheduledCallbacks(callbacks);
      setCurrentIndex(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar CRM');
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const dialerQueue = useMemo(() => getDialerQueue(leads), [leads]);
  const currentLead = dialerQueue[currentIndex] ?? null;
  const nextInQueue = dialerQueue[currentIndex + 1] ?? null;

  const callbackLeads = useMemo(
    () =>
      leads.filter(
        (l) =>
          l.status === 'En seguimiento' ||
          l.status === 'Cerca de cierre' ||
          (l.notes?.toLowerCase().includes('callback') ?? false)
      ),
    [leads]
  );

  const depositKpis = useMemo(() => {
    const approved = deposits.filter((d) => d.status === 'Aprobado');
    const ftdApproved = approved.filter((d) => d.type === 'FTD');
    const retention = approved.filter((d) => d.type === 'RETENCION');
    return {
      ftdCount: ftdApproved.length,
      ftdVolume: ftdApproved.reduce((s, d) => s + Number(d.amount), 0),
      retentionVolume: retention.reduce((s, d) => s + Number(d.amount), 0),
      pendingCount: deposits.filter((d) => d.status === 'Verificando').length,
    };
  }, [deposits]);

  const goToNextLead = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, Math.max(0, dialerQueue.length - 1)));
  }, [dialerQueue.length]);

  const applyLeadUpdate = useCallback(
    async (leadId: string, status: LeadStatus, notes?: string) => {
      setSaving(true);
      const updated = await updateMyLead(leadId, {
        status,
        notes: notes ?? undefined,
      });
      setSaving(false);
      if (updated) {
        await refresh();
        goToNextLead();
      }
      return !!updated;
    },
    [refresh, goToNextLead]
  );

  return {
    leads,
    sortedLeads: sortLeadsForDialer(leads),
    dialerQueue,
    currentLead,
    nextInQueue,
    currentIndex,
    setCurrentIndex,
    callbackLeads,
    scheduledCallbacks,
    deposits,
    depositKpis,
    stats,
    loading,
    error,
    saving,
    isDemo,
    refresh,
    goToNextLead,
    applyLeadUpdate,
  };
}
