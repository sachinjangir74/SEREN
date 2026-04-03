import React from 'react';
import {
  HeroSection,
  TrustLogos,
  QuoteSection,
  InfoSection,
  FeaturesSection,
  TherapistPreview,
  CTABanner,
  ServicesSection,
  ProgramsSection,
  FAQSection
} from '../components/home/HomeSections';

const Home = () => {
  return (
    <div className="font-sans text-slate-900 bg-white overflow-x-hidden pt-28">
      {/* 
        The top padding (pt-28) ensures content doesn't get hidden 
        underneath the fixed global navigation bar.
      */}
      <HeroSection />
      <TrustLogos />
      <QuoteSection />
      <InfoSection />
      <FeaturesSection />
      <TherapistPreview />
      <CTABanner />
      <ServicesSection />
      <ProgramsSection />
      <FAQSection />
    </div>
  );
};

export default Home;
 

