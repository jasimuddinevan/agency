import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import ProcessSection from '../components/home/ProcessSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import TrustSection from '../components/home/TrustSection';
import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 lg:pt-18">
      {/* Section 1: Hero */}
      <HeroSection />
      
      {/* Section 2: Services */}
      <div id="services">
        <ServicesSection />
      </div>
      
      {/* Section 3: Stats/Metrics */}
      <StatsSection />
      
      {/* Section 4: Process */}
      <ProcessSection />
      
      {/* Section 5: Testimonials */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      
      {/* Section 6: Trust & Certifications */}
      <TrustSection />
      
      {/* Section 7: CTA */}
      <div id="contact">
        <CTASection />
      </div>
    </div>
  );
};

export default HomePage;