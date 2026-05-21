import { Navbar } from "../components/Navbar";
import { TickerTape } from "../components/TickerTape";
import { HeroSection } from "../components/HeroSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { AdvancedToolsSection } from "../components/AdvancedToolsSection";
import { WhatWeOfferSection } from "../components/WhatWeOfferSection";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <Navbar />
      <TickerTape />
      <main>
        <HeroSection />
        <BenefitsSection />
        <AdvancedToolsSection />
        <WhatWeOfferSection />
      </main>
      <Footer />
    </div>
  );
}
