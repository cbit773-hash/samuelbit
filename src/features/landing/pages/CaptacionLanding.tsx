import { useEffect, useState } from 'react';
import { trackLeadConversion } from '../../../shared/utils/analytics';
import type { CaptacionSubmitResult } from '../types/captacion-form';
import { RegistroNavbar } from '../components/captacion/RegistroNavbar';
import { RegistroSplitLayout } from '../components/captacion/RegistroSplitLayout';
import { GeneratedPasswordReveal } from '../components/captacion/GeneratedPasswordReveal';

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

function getUTMParams(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

export function CaptacionLanding() {
  const [result, setResult] = useState<CaptacionSubmitResult | null>(null);
  const [interest, setInterest] = useState('Desconocido');
  const [utmNote, setUtmNote] = useState<string | null>(null);
  const [utm, setUtm] = useState<UtmParams>(getUTMParams);

  useEffect(() => {
    const utmParams = getUTMParams();
    setUtm(utmParams);
    const parts = Object.entries(utmParams)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`);
    if (parts.length) setUtmNote(parts.join(' · '));

    const params = new URLSearchParams(window.location.search);
    const asset = params.get('asset') || params.get('interest');
    if (asset) setInterest(asset);
  }, []);

  const handleSuccess = (data: CaptacionSubmitResult) => {
    setResult(data);
    trackLeadConversion({
      name: data.fullName,
      phone: data.phone,
      email: data.email,
      country: data.country,
      lead_id: data.leadId,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
    });
  };

  if (result) {
    return (
      <div data-theme="invest-dark" className="min-h-screen bg-[#1a1d21]">
        <RegistroNavbar />
        <main className="flex items-center justify-center min-h-screen px-5 py-24">
          <GeneratedPasswordReveal
            email={result.email}
            password={result.generatedPassword}
            firstName={result.firstName}
          />
        </main>
      </div>
    );
  }

  return (
    <div data-theme="invest-dark" className="min-h-screen bg-[#1a1d21]">
      <RegistroNavbar />
      <RegistroSplitLayout
        interest={interest}
        utmNotes={utmNote}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
