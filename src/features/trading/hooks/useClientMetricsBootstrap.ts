/**
 * @deprecated La sincronización de métricas del cliente vive en ClientDataProvider.
 * Este hook se mantiene vacío para no romper imports legacy.
 */
export function useClientMetricsBootstrap() {
  // no-op: ClientDataProvider + useClientPositions cubren bootstrap
}
