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

import Footer from "@/components/Footer";

const TrustSection = () => {
  const partners = [
    {
      id: 1,
      name: "État du Valais",
      logo: "/lovable-uploads/5fa1fb9e-199c-42f2-86b5-b7c475090786.png",
      alt: "Logo Canton du Valais"
    },
    {
      id: 2,
      name: "Car Center – Ardon",
      logo: "/lovable-uploads/83644970-ea1a-4641-aece-8e119c884d9e.png",
      alt: "Logo Car Center Ardon"
    },
    {
      id: 3,
      name: "Alexprod – Sierre",
      logo: "/lovable-uploads/44c5fe03-0dcb-4052-a277-84d8bf3c940c.png",
      alt: "Logo Alexprod Sierre"
    },
    {
      id: 4,
      name: "Hadid Hairstyle – Brig",
      logo: "/lovable-uploads/bb7994a2-533e-4310-b09b-1de7b45ceb4a.png",
      alt: "Logo Hadid Hairstyling"
    }
  ];

  // Dupliquer les partenaires pour un défilement continu
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="section-padding bg-gradient-to-r from-white to-blue-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          Ils nous ont fait confiance et sont satisfaits :
        </h2>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-right space-x-12">
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="flex flex-col items-center min-w-[200px]">
              <img
                src={partner.logo}
                alt={partner.alt}
                className="object-contain w-24 h-24 lg:w-28 lg:h-28 mb-3"
                draggable={false}
              />
              <span className="text-sm text-gray-700 font-semibold text-center whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IndexFr = () => {
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

export default IndexFr;