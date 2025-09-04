import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import VideoSection from "@/components/VideoSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatsSection from "@/components/StatsSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('reservation') === 'true') {
      setIsReservationModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen relative">
      <Header 
        onReservationClick={() => setIsReservationModalOpen(true)}
        isReservationModalOpen={isReservationModalOpen}
        onReservationModalClose={() => setIsReservationModalOpen(false)}
      />
      <main>
        <HeroSection onReservationClick={() => setIsReservationModalOpen(true)} />
        <ServicesSection />
        <HowItWorksSection />
        <AboutSection />
        <GallerySection />
        <VideoSection />
        <ReviewsSection />
        <StatsSection />
        
        <TrustSection />
      </main>
      <Footer />

      {/* Bouton WhatsApp flottant */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
