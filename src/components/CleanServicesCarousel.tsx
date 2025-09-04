
import React, { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Service } from "@/types/reservation";
import { icons, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceInfoModal } from "@/components/cart/ServiceInfoModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface CleanServicesCarouselProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
}

const CleanServicesCarousel: React.FC<CleanServicesCarouselProps> = ({
  services,
  onServiceClick,
  onAddToCart,
}) => {
  const { t } = useLanguage();
  const [infoService, setInfoService] = useState<Service | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      slidesToScroll: 1,
      dragFree: false,
      containScroll: "trimSnaps",
      direction: "ltr"
    },
    [Autoplay({ 
      delay: 6000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true,
      direction: "forward"
    })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </Button>

      {/* Carousel */}
      <div className="overflow-hidden px-16" ref={emblaRef}>
        <div className="flex gap-4">
          {services.map((service) => {
            const IconComponent = icons[service.icon as keyof typeof icons];
            
            return (
              <div 
                key={service.id} 
                className="flex-none w-72 h-80"
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl h-full relative"
                  onClick={() => setInfoService(service)}
                >

                  <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                      <div className="flex flex-col items-center">
                        <div className="mb-6">
                          {IconComponent && (
                            <div className="service-icon-container w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 p-0">
                              <IconComponent className="service-icon-pulse w-12 h-12 text-primary" />
                              {/* Bulles de savon */}
                              <div className="bubble bubble-1"></div>
                              <div className="bubble bubble-2"></div>
                              <div className="bubble bubble-3"></div>
                              <div className="bubble bubble-4"></div>
                              <div className="bubble bubble-5"></div>
                            </div>
                          )}
                        </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {t(`services.${service.id}.name`)}
                      </h3>
                    </div>
                    
                    <Button
                      variant="default"
                      className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoService(service);
                      }}
                    >
                      {t('common.learn_more')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Info Modal */}
      <ServiceInfoModal
        service={infoService}
        isOpen={!!infoService}
        onClose={() => setInfoService(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default CleanServicesCarousel;
