import { darkUi } from '../../../shared/theme/dark-ui';
import { TickerTape } from '../components/TickerTape';
import { BenefitsSection } from '../components/BenefitsSection';
import { WhatWeOfferSection } from '../components/WhatWeOfferSection';
import { RiskDisclaimer } from '../../../shared/components/RiskDisclaimer';
import { MarketingShell } from '../../../shared/layout/MarketingShell';
import {
  MarketingNavbar,
  MarketingFooter,
  LandingHero,
  TrustStatsBar,
  MarketsSection,
  TerminalShowcase,
  StepsTimeline,
  FaqSection,
  CtaBand,
  StickyCtaBar,
} from '../components/marketing';

export function LandingPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <TickerTape />
      <main className={`${darkUi.bgPage} ${darkUi.textPrimary}`}>
        <LandingHero />
        <TrustStatsBar />
        <MarketsSection />
        <TerminalShowcase />
        <BenefitsSection />
        <WhatWeOfferSection />
        <StepsTimeline />
        <FaqSection />
        <CtaBand />
      </main>
      <MarketingFooter />
      <StickyCtaBar />
      <RiskDisclaimer />
    </MarketingShell>
  );
}
