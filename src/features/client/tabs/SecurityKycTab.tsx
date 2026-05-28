import { KycUploadPanel } from '../../kyc/components/KycUploadPanel';

export function SecurityKycTab() {
  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <KycUploadPanel />
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-muted text-xs mb-3 uppercase font-bold">Próximamente</p>
        <div className="bg-accent-lime/10 border border-brand/30 p-5 rounded-xl flex justify-between items-center opacity-60">
          <div>
            <p className="text-foreground font-bold">Autenticación 2FA</p>
            <p className="text-brand400 text-sm">Próxima versión</p>
          </div>
        </div>
      </div>
    </div>
  );
}
