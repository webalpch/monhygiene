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

import Footer from "@/components/Footer";

const TrustSection = () => (
  <section className="section-padding bg-gradient-to-r from-white to-blue-50 border-t border-gray-200">
    <div className="max-w-4xl mx-auto text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
        They trusted us and are satisfied:
      </h2>
    </div>
    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {/* State of Valais */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-xl shadow flex items-center justify-center mb-2 p-2">
          <img
            src="/lovable-uploads/5fa1fb9e-199c-42f2-86b5-b7c475090786.png"
            alt="Logo Canton of Valais"
            className="object-contain w-full h-full max-w-16 max-h-16 sm:max-w-20 sm:max-h-20"
            draggable={false}
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-700 font-semibold text-center px-1">State of Valais</span>
      </div>
      {/* Car Center – Ardon */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-xl shadow flex items-center justify-center mb-2 p-2">
          {/* Logo coming */}
          <span className="text-xs text-gray-400 text-center">logo coming</span>
        </div>
        <span className="text-xs sm:text-sm text-gray-700 font-semibold text-center px-1">Car Center – Ardon</span>
      </div>
      {/* Alexprod – Sierre */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-xl shadow flex items-center justify-center mb-2 p-2">
          <img
            src="/lovable-uploads/44c5fe03-0dcb-4052-a277-84d8bf3c940c.png"
            alt="Logo Alexprod Sierre"
            className="object-contain w-full h-full max-w-14 max-h-14 sm:max-w-18 sm:max-h-18"
            draggable={false}
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-700 font-semibold text-center px-1">Alexprod – Sierre</span>
      </div>
      {/* Hadid Hairstyle – Brig */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-xl shadow flex items-center justify-center mb-2 p-2">
          <img
            src="/lovable-uploads/bb7994a2-533e-4310-b09b-1de7b45ceb4a.png"
            alt="Logo Hadid Hairstyling"
            className="object-contain w-full h-full max-w-18 max-h-18 sm:max-w-20 sm:max-h-20"
            draggable={false}
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-700 font-semibold text-center px-1">Hadid Hairstyle – Brig</span>
      </div>
    </div>
  </section>
);

const IndexEn = () => {
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

export default IndexEn;