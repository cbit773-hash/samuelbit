// ============================================================
// INVESPRO — Hook genérico para queries a Supabase
// Alternativa ligera a React Query para datos de Supabase
// ============================================================
import { useState, useEffect, useCallback } from 'react';

interface UseSupabaseQueryOptions {
  /** Si es false, la query no se ejecuta automáticamente */
  enabled?: boolean;
  /** Intervalo de refetch en ms (0 = sin refetch) */
  refetchInterval?: number;
}

interface UseSupabaseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook genérico para ejecutar queries a Supabase con manejo de estado.
 * 
 * @example
 * const { data: leads, isLoading, refetch } = useSupabaseQuery(() => getAllLeads());
 * const { data: deposits } = useSupabaseQuery(() => getDepositsByStatus('Verificando'), { refetchInterval: 30000 });
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  options: UseSupabaseQueryOptions = {}
): UseSupabaseQueryResult<T> {
  const { enabled = true, refetchInterval = 0 } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al consultar Supabase');
      console.error('[useSupabaseQuery] Error:', err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0 && enabled) {
      const interval = setInterval(refetch, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, enabled, refetch]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook para ejecutar mutaciones (create, update, delete) con estado de loading.
 * 
 * @example
 * const { mutate: approve, isLoading } = useSupabaseMutation(approveDeposit);
 * await approve('deposit-id');
 */
export function useSupabaseMutation<TArgs extends any[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (...args: TArgs): Promise<TResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar la operación');
      console.error('[useSupabaseMutation] Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mutate, isLoading, error };
}
