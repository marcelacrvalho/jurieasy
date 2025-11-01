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

      <section className="video-section">
        <div className="max-w-4xl mx-auto">
          <video
            src="/ui-questions.mp4"
            width={800}
            height={450}
            controls
            autoPlay
            muted
            loop
            className="w-full"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      </section>

      <HowItWorks />

      <SocialProof />
      <Testimonial />
      <Prices />
      <FAQ />
      <Footer />
    </>
  )
}