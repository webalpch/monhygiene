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
import { CartWidget } from "@/components/CartWidget";
import { useLanguage } from "@/contexts/LanguageContext";

import Footer from "@/components/Footer";

const TrustSection = () => {
  const { t } = useLanguage();
  const partners = [
    {
      id: 1,
      name: "State of Valais",
      logo: "/lovable-uploads/3d610b46-2569-4ee4-86db-669409edef7b.png",
      alt: "Logo Canton of Valais"
    },
    {
      id: 2,
      name: "Car Center – Ardon",
      logo: "/lovable-uploads/98a1f02c-9749-4cbd-a8cf-96475fd1f9cb.png",
      alt: "Logo Car Center Ardon"
    },
    {
      id: 3,
      name: "Alexprod – Sierre",
      logo: "/lovable-uploads/dfcbe5dd-3e03-4f13-8d6c-3f179e1165eb.png",
      alt: "Logo Alexprod Sierre"
    },
    {
      id: 4,
      name: "Hadid Hairstyle – Brig",
      logo: "/lovable-uploads/fabc540b-197d-4c18-9d85-8e9b53f856f8.png",
      alt: "Logo Hadid Hairstyling"
    }
  ];

  // Créer deux sets identiques pour un défilement parfaitement continu
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="section-padding bg-transparent border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          They trusted us and are satisfied:
        </h2>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-right">
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="flex flex-col items-center min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] flex-shrink-0 mx-4 sm:mx-6 lg:mx-8">
              <img
                src={partner.logo}
                alt={partner.alt}
                className="object-contain w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-2 lg:mb-3 transform-gpu"
                style={{ objectFit: 'contain', minWidth: '80px', minHeight: '80px' }}
                draggable={false}
              />
              <span className="text-xs sm:text-sm text-gray-700 font-semibold text-center whitespace-nowrap px-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
      
      {/* Widget Panier */}
      <CartWidget />
    </div>
  );
};

export default IndexEn;