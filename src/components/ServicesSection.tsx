import { useState } from "react";
import { Service } from '@/types/reservation';
import { getServices } from '@/data/services';
import CleanServicesCarousel from './CleanServicesCarousel';
import { ReservationModal } from './ReservationModal';
import { useFadeInOnScroll } from '@/hooks/useFadeInOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';

const ServicesSection = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { ref: sectionRef, isVisible } = useFadeInOnScroll();
  const { ref: carouselRef, isVisible: carouselVisible } = useFadeInOnScroll();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const services = getServices(t);

  const handleAddToCartAndReserve = (service: Service) => {
    // Ne pas ajouter directement au panier ici
    // Laisser ServiceInfoModal gérer l'ajout au panier selon ses propres règles
    setIsReservationOpen(true);
  };

  const handleCloseReservation = () => {
    setIsReservationOpen(false);
  };

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-gray-50 to-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            {t('services.title')}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed sm:br-mobile line-clamp-2 md:line-clamp-none">
            {t('services.subtitle')}
          </p>
        </div>

        <div ref={carouselRef} className={`transition-all duration-1000 delay-300 ${carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CleanServicesCarousel
            services={services}
            onServiceClick={handleAddToCartAndReserve}
            onAddToCart={addToCart}
          />
        </div>

        <ReservationModal
          isOpen={isReservationOpen}
          onClose={handleCloseReservation}
        />
      </div>
    </section>
  );
};

export default ServicesSection;