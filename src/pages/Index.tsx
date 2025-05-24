
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import PopularDatePlans from '@/components/PopularDatePlans';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <PopularDatePlans />
      <Footer />
    </div>
  );
};

export default Index;
