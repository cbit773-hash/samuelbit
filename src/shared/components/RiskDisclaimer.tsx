import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * RiskDisclaimer — Persistent risk warning banner
 * 
 * Sticky banner at the bottom of public pages (landing, captación) that warns
 * users about the risks of CFD/crypto trading. Required by Google Ads policies
 * for financial services advertising.
 * 
 * Can be dismissed per session (stores in sessionStorage).
 */
export function RiskDisclaimer() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('risk_disclaimer_dismissed') === 'true'; }
    catch { return false; }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('risk_disclaimer_dismissed', 'true'); } catch { /* noop */ }
  };

  return (
    <div
      id="risk-disclaimer"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-rose-500/20 shadow-[0_-4px_30px_rgba(239,68,68,0.1)]"
      style={{ animation: 'slideUp 0.5s ease-out' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start md:items-center gap-3">
        <div className="shrink-0 mt-0.5 md:mt-0">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] md:text-xs text-gray-300 leading-relaxed">
            <strong className="text-rose-400">⚠️ Advertencia de Riesgo:</strong>{' '}
            Los CFDs y criptomonedas son instrumentos complejos con alto riesgo de pérdida rápida de capital debido al apalancamiento. 
            Opere solo con capital que pueda permitirse perder. Rendimientos pasados no garantizan resultados futuros.{' '}
            <Link to="/legal/terminos" className="text-amber-500 hover:underline font-medium">T&C</Link>{' · '}
            <Link to="/legal/privacidad" className="text-amber-500 hover:underline font-medium">Privacidad</Link>
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
          aria-label="Cerrar advertencia de riesgo"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
