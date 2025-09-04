import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Service } from '@/types/reservation';
import { icons, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { ServiceFormModal } from './ServiceFormModal';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceInfoModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (service: Service) => void;
}

export const ServiceInfoModal: React.FC<ServiceInfoModalProps> = ({ service, isOpen, onClose, onAddToCart }) => {
  const { t } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  if (!service) return null;

  const IconComponent = icons[service.icon as keyof typeof icons];

  // Pack data for vehicle service
  const packs = {
    M: {
      price: 80,
      features: [
        t('services.vehicle.pack_m.feature_1'),
        t('services.vehicle.pack_m.feature_2'),
        t('services.vehicle.pack_m.feature_3'),
        t('services.vehicle.pack_m.feature_4')
      ]
    },
    L: {
      price: 120,
      features: [
        t('services.vehicle.pack_l.feature_1'),
        t('services.vehicle.pack_l.feature_2'),
        t('services.vehicle.pack_l.feature_3'),
        t('services.vehicle.pack_l.feature_4'),
        t('services.vehicle.pack_l.feature_5')
      ]
    },
    Premium: {
      price: 180,
      features: [
        t('services.vehicle.pack_premium.feature_1'),
        t('services.vehicle.pack_premium.feature_2'),
        t('services.vehicle.pack_premium.feature_3'),
        t('services.vehicle.pack_premium.feature_4'),
        t('services.vehicle.pack_premium.feature_5'),
        t('services.vehicle.pack_premium.feature_6')
      ]
    }
  };

  // Extended service information
  const getServiceDetails = (serviceId: string) => {
    // Fonction pour obtenir toutes les features d'un service
    const getFeatures = (id: string): string[] => {
      const features = [];
      let i = 1;
      while (true) {
        const featureKey = `services.${id}.feature_${i}`;
        const feature = t(featureKey);
        if (feature === featureKey) break; // Si la traduction n'existe pas, arrêter
        features.push(feature);
        i++;
      }
      return features.length > 0 ? features : [
        t('services.common.professional_service'),
        t('services.common.quality_equipment'),
        t('services.common.experienced_technicians'),
        t('services.common.satisfaction_guarantee')
      ];
    };

    return {
      description: t(`services.${serviceId}.description`),
      features: getFeatures(serviceId),
      duration: t(`services.${serviceId}.duration`) || t('services.common.default_duration'),
      priceRange: t(`services.${serviceId}.price_range`) || t('services.common.quote_based')
    };
  };

  const details = getServiceDetails(service.id);

  const handleAddToCart = () => {
    // Pour certains services, ouvrir directement le formulaire de configuration
    const servicesNeedingConfig = ['nettoyage-vehicule', 'nettoyage-terrasse', 'nettoyage-canape', 'nettoyage-matelas', 'nettoyage-domicile', 'nettoyage-bureaux', 'shampooinage-sieges'];
    
    if (servicesNeedingConfig.includes(service.id)) {
      setIsFormModalOpen(true);
    } else {
      // Pour les autres services, ajouter directement au panier
      let price = 100; // Prix par défaut
      if (service.id === 'shampooinage-sieges') {
        price = 100;
      } else if (['nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'].includes(service.id)) {
        price = 0; // Prix sur devis
      }
      addToCart(service, {}, price);
      onClose();
    }
  };

  const handleFormSubmit = async (service: Service, formData: Record<string, any>, price: number) => {
    try {
      await addToCart(service, formData, price);
      setIsFormModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden mx-2 sm:mx-auto">
        <div className="overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-primary/20">
          <DialogHeader className="sticky top-0 z-10 pb-4">
            <DialogTitle className="flex items-center space-x-3">
              {IconComponent && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
              )}
              <span>{t(`services.${service.id}.name`)}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 px-1">
            <p className="text-gray-600">{t(`services.${service.id}.description`)}</p>

            {/* Pack selection for vehicle service */}
            {service.id === 'nettoyage-vehicule' && (
              <div>
                <h4 className="font-medium mb-3">{t('services.vehicle.packages_title')}</h4>
                <div className="space-y-2">
                  {Object.entries(packs).map(([packType, packData]) => (
                    <Collapsible key={packType}>
                      <CollapsibleTrigger 
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedPack(selectedPack === packType ? null : packType)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{t(`services.vehicle.pack_${packType.toLowerCase()}.name`)}</span>
                          
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${selectedPack === packType ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className={selectedPack === packType ? 'block' : 'hidden'}>
                        <div className="p-3 border-l-2 border-primary/20 ml-3 mt-2">
                          <ul className="space-y-1">
                            {packData.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            {/* Default features for other services */}
            {service.id !== 'nettoyage-vehicule' && (
              <div>
                <h4 className="font-medium mb-2">{t('services.common.included_services')}</h4>
                <ul className="space-y-1">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prix et durée */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('services.common.price')}:</span>
                <span className="font-medium">{details.priceRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('services.common.duration')}:</span>
                <span className="font-medium">{details.duration}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white pt-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 min-h-[44px]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('cart.add_to_cart')}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 min-h-[44px]"
              >
                {t('common.close')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Service Form Modal */}
      <ServiceFormModal
        service={service}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Dialog>
  );
};