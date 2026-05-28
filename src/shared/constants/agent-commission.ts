/** Porcentaje MVP de comisión sobre volumen FTD aprobado (CHIEF auditará regla final). */
export const AGENT_FTD_COMMISSION_RATE = 0.08;

export function projectedCommission(ftdVolumeApproved: number): number {
  return Math.round(ftdVolumeApproved * AGENT_FTD_COMMISSION_RATE * 100) / 100;
}
