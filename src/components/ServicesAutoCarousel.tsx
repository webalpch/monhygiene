
import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Service } from "@/types/reservation";
import { icons, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/components/reservation/ServiceCarousel.css"; // pour les styles responsive embla

interface ServicesAutoCarouselProps {
  services: Service[];
  selectedService: Service | undefined;
  setSelectedService: (service: Service) => void;
}

const ServicesAutoCarousel: React.FC<ServicesAutoCarouselProps> = ({
  services,
  selectedService,
  setSelectedService,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, slidesToScroll: 1 },
    [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Pour que lorsqu'on sélectionne un service, il soit centré
  useEffect(() => {
    if (emblaApi && selectedService) {
      const idx = services.findIndex((s) => s.id === selectedService.id);
      if (idx !== -1) {
        emblaApi.scrollTo(idx);
      }
    }
  }, [selectedService, emblaApi, services]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-5xl mx-auto mb-12">
      {/* Bouton flèche gauche */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Bouton flèche droite */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="embla px-12">
        <div className="embla__container">
          {services.map((service) => {
            const IconComponent = icons[service.icon as keyof typeof icons];
            const isSelected = selectedService?.id === service.id;
            return (
              <div className="embla__slide" key={service.id}>
                <button
                  onClick={() => setSelectedService(service)}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-200 text-center flex flex-col items-center shadow-sm hover:shadow-md focus:outline-none
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-gray-200 hover:border-primary/70"
                    }`}
                  style={{ minWidth: "220px" }}
                >
                  <div className="mb-3">
                    {IconComponent && (
                      <IconComponent className="w-9 h-9 text-primary mb-1" />
                    )}
                  </div>
                  <div className={`font-semibold text-lg mb-2 ${isSelected ? "text-primary" : "text-gray-900"}`}>
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesAutoCarousel;
