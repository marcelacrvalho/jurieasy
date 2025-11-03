"use client";

import Benefits from "@/components/landing/Benefits";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Prices from "@/components/landing/Prices";
import SocialProof from "@/components/landing/SocialProof";
import Testimonial from "@/components/landing/Testimonial";
import Header from "@/components/shared/Header";

export default function LandingPage() {
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
      <Footer />
    </>
  )
}