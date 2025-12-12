// app/page.tsx ou onde estiver sua LandingPage
"use client";

import { useState } from 'react';
import Benefits from "@/components/landing/Benefits";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Prices from "@/components/landing/Prices";
import SocialProof from "@/components/landing/SocialProof";
import Testimonial from "@/components/landing/Testimonial";
import Header from "@/components/landing/Header";
import LegalSections from "@/components/landing/LegalSections";

export default function LandingPage() {
  const [activeLegalSection, setActiveLegalSection] = useState<string | null>(null);

  const handleLegalClick = (sectionId: string) => {
    setActiveLegalSection(sectionId);
  };

  return (
    <>
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <SocialProof />
      <Testimonial />
      <Prices />
      <FAQ />
      <Footer onLegalClick={handleLegalClick} />

      {/* LegalSections agora é um modal controlado pelo estado */}
      <LegalSections
        activeSection={activeLegalSection}
        onClose={() => setActiveLegalSection(null)}
      />
    </>
  );
}