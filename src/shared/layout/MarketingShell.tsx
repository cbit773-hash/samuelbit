import type { ReactNode } from 'react';

interface MarketingShellProps {
  children: ReactNode;
}

/** Contenedor landings — tema oscuro + texto claro */
export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div
      data-theme="invest-dark"
      className="min-h-screen bg-[#1a1d21] text-[#f5f6f4] font-sans selection:bg-[rgba(159,232,112,0.2)] selection:text-[#163300]"
    >
      {children}
    </div>
  );
}
