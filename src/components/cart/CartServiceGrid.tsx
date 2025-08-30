import React, { useState } from 'react';
import { Service } from '@/types/reservation';
import { SERVICES } from '@/data/services';
import { icons, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceInfoModal } from './ServiceInfoModal';
import { ServiceFormModal } from './ServiceFormModal';

interface CartServiceGridProps {
  onAddToCart: (service: Service, formData?: Record<string, any>, price?: number) => void;
}

export const CartServiceGrid: React.FC<CartServiceGridProps> = ({ onAddToCart }) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [infoService, setInfoService] = useState<Service | null>(null);
  const [formService, setFormService] = useState<Service | null>(null);

  const handleAddToCart = (service: Service) => {
    // Services requiring forms
    const servicesWithForms = [
      'nettoyage-vehicule',
      'nettoyage-canape', 
      'nettoyage-matelas',
      'nettoyage-domicile',
      'nettoyage-bureaux'
    ];

    if (servicesWithForms.includes(service.id)) {
      setFormService(service);
    } else {
      // Default prices for services without forms
      const defaultPrices: Record<string, number> = {
        'shampooinage-sieges': 80,
        'nettoyage-billard': 130,
        'nettoyage-vitres': 120,
        'nettoyage-terrasse': 150,
        'nettoyage-toiture': 200,
        'nettoyage-moquette-tapis': 100,
        'nettoyage-fin-chantier': 300,
        'nettoyage-post-demenagement': 250,
        'entretien-espaces-verts': 180,
        'desinfection': 150,
        'nettoyage-haute-pression': 120,
        'autres-services': 100
      };

      onAddToCart(service, {}, defaultPrices[service.id] || 100);
    }
  };

  const handleFormSubmit = (service: Service, formData: Record<string, any>, price: number) => {
    onAddToCart(service, formData, price);
    setFormService(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SERVICES.map((service) => {
          const IconComponent = icons[service.icon as keyof typeof icons];
          const isHovered = hoveredService === service.id;

          return (
            <Card
              key={service.id}
              className="relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-32 sm:h-36"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center relative">
                {/* Service Icon and Name */}
                <div className="flex flex-col items-center space-y-2">
                  {IconComponent && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-primary/10">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  )}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                    {service.name}
                  </h3>
                </div>

                {/* Hover Buttons */}
                {isHovered && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center space-x-2 animate-fade-in">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoService(service);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(service);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Mobile tap targets (visible on touch devices) */}
                <div className="sm:hidden absolute bottom-1 left-1 right-1 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoService(service);
                    }}
                    className="h-6 w-6 p-0 bg-white/80"
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(service);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Info Modal */}
      <ServiceInfoModal
        service={infoService}
        isOpen={!!infoService}
        onClose={() => setInfoService(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Service Form Modal */}
      <ServiceFormModal
        service={formService}
        isOpen={!!formService}
        onClose={() => setFormService(null)}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};