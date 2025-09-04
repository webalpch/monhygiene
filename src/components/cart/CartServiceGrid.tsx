import React, { useState } from 'react';
import { Service } from '@/types/reservation';
import { getServices } from '@/data/services';
import { icons, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceInfoModal } from './ServiceInfoModal';
import { ServiceFormModal } from './ServiceFormModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartServiceGridProps {
  onAddToCart: (service: Service, formData?: Record<string, any>, price?: number) => void;
}

export const CartServiceGrid: React.FC<CartServiceGridProps> = ({ onAddToCart }) => {
  const { t } = useLanguage();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [infoService, setInfoService] = useState<Service | null>(null);
  const [formService, setFormService] = useState<Service | null>(null);
  
  const services = getServices(t);

  const handleAddToCart = (service: Service) => {
    // Services requiring forms
    const servicesWithForms = [
      'nettoyage-vehicule',
      'nettoyage-canape', 
      'nettoyage-matelas',
      'nettoyage-domicile',
      'nettoyage-bureaux',
      'shampooinage-sieges'
    ];

    if (servicesWithForms.includes(service.id)) {
      setFormService(service);
    } else {
      // Default prices for services without forms
      const defaultPrices: Record<string, number> = {
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
        {services.map((service) => {
          const IconComponent = icons[service.icon as keyof typeof icons];
          const isHovered = hoveredService === service.id;

          return (
            <Card
              key={service.id}
              className="relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-32 sm:h-36"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => handleAddToCart(service)}
            >
              <CardContent className="p-3 h-full flex flex-col items-center justify-center text-center relative">
                {/* Service Icon and Name */}
                <div className="flex flex-col items-center space-y-1.5">
                  {IconComponent && (
                    <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-primary/10">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug break-words hyphens-auto px-1 min-h-[2.5rem] flex items-center">
                    {service.name}
                  </h3>
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