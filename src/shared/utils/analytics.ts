/**
 * Google Tag Manager & Google Ads — Analytics Utilities
 * 
 * Centralized helper functions for pushing events to the dataLayer
 * and firing Google Ads conversion pixels.
 * 
 * ── Setup Instructions ──
 * 1. Replace GTM-XXXXXXX in index.html with your GTM container ID
 * 2. Replace AW-XXXXXXXXX with your Google Ads account ID
 * 3. Replace AW-XXXXXXXXX/XXXXXXXX with your conversion action ID
 * 
 * ── GTM Container Tags to Configure ──
 * In GTM, create these tags:
 *   - Google Ads Conversion Tracking (trigger: custom event "lead_form_submit")
 *   - Google Analytics 4 (trigger: All Pages)
 *   - Google Ads Remarketing (trigger: All Pages)
 */

// Extend window for TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Push a custom event to the GTM dataLayer.
 */
export function pushToDataLayer(event: string, data?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
}

/**
 * Fire a Google Ads conversion event.
 * 
 * @param conversionId - e.g. 'AW-XXXXXXXXX/XXXXXXXX'
 * @param value - optional conversion value in USD
 */
export function fireConversion(conversionId: string, value?: number) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value ?? 0,
      currency: 'USD',
    });
  }
}

/**
 * Track lead form submission — pushes to both GTM dataLayer 
 * and fires Google Ads conversion pixel.
 * 
 * Call this after a successful form submission on /registro.
 */
export function trackLeadConversion(leadData: {
  name: string;
  phone: string;
  email?: string;
  country: string;
  utm_source?: string;
  utm_campaign?: string;
}) {
  // 1. Push to GTM dataLayer (triggers conversion tag in GTM)
  pushToDataLayer('lead_form_submit', {
    lead_name: leadData.name,
    lead_phone: leadData.phone,
    lead_email: leadData.email || '',
    lead_country: leadData.country,
    utm_source: leadData.utm_source || '',
    utm_campaign: leadData.utm_campaign || '',
  });

  // 2. Fire Google Ads conversion directly via gtag
  // TODO: Replace with your actual conversion ID from Google Ads
  fireConversion('AW-XXXXXXXXX/XXXXXXXX', 250);
}

/**
 * Track page view (useful for SPA navigation).
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  pushToDataLayer('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('config', 'AW-XXXXXXXXX', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}
