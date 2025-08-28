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

interface ServiceInfoModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (service: Service) => void;
}

export const ServiceInfoModal: React.FC<ServiceInfoModalProps> = ({ service, isOpen, onClose, onAddToCart }) => {
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
        'Aspiration complète de l\'intérieur',
        'Nettoyage et traitement spécial du tableau de bord et plastiques (finition brillante)',
        'Nettoyage express des tapis de sol',
        '1 désodorisant VIP'
      ]
    },
    L: {
      price: 120,
      features: [
        'Tout ce qui est inclus dans le Pack M',
        'Nettoyage des seuils et contours de portes',
        'Nettoyage intérieur des vitres',
        'Nettoyage du coffre',
        '1 désodorisant VIP'
      ]
    },
    Premium: {
      price: 180,
      features: [
        'Tout ce qui est inclus dans le Pack L',
        'Nettoyage à la vapeur complet de l\'intérieur',
        'Nettoyage vapeur et express des sièges',
        'Nettoyage approfondi des tapis de sol',
        'Application de parfum léger et agréable',
        '1 désodorisant VIP offert'
      ]
    }
  };

  // Extended service information
  const getServiceDetails = (serviceId: string) => {
    switch (serviceId) {
      case 'nettoyage-vehicule':
        return {
          description: 'Service de nettoyage complet pour votre véhicule',
          features: [
            'Nettoyage intérieur complet',
            'Lavage extérieur détaillé',
            'Aspiration des sièges et tapis',
            'Nettoyage des vitres',
            'Désinfection si demandée'
          ],
          duration: '2-3 heures',
          priceRange: 'À partir de 80 CHF'
        };
      case 'nettoyage-canape':
        return {
          description: 'Nettoyage de votre canapé à domicile',
          features: [
            'Nettoyage en profondeur',
            'Élimination des taches',
            'Désodorisation',
            'Séchage rapide',
            'Produits écologiques'
          ],
          duration: '1-2 heures',
          priceRange: 'À partir de 50 CHF'
        };
      case 'nettoyage-matelas':
        return {
          description: 'Hygiène et propreté de votre matelas',
          features: [
            'Élimination des acariens',
            'Nettoyage anti-allergène',
            'Désinfection complète',
            'Séchage professionnel',
            'Toutes tailles de matelas'
          ],
          duration: '1 heure',
          priceRange: 'À partir de 95 CHF'
        };
      case 'nettoyage-vitres':
        return {
          description: 'Nettoyage de vitres intérieur et extérieur',
          features: [
            'Nettoyage sans traces',
            'Produits spécialisés',
            'Matériel professionnel',
            'Intérieur et extérieur',
            'Finition impeccable'
          ],
          duration: '1-2 heures',
          priceRange: 'Sur devis - Dépend de la surface et du nombre de vitres'
        };
      case 'nettoyage-moquette-tapis':
        return {
          description: 'Nettoyage de moquettes et tapis',
          features: [
            'Nettoyage en profondeur',
            'Élimination des taches',
            'Désodorisation',
            'Séchage rapide',
            'Toutes surfaces textiles'
          ],
          duration: '2-3 heures',
          priceRange: 'Sur devis - Dépend de la surface et du type de matériau'
        };
      case 'autres-services':
        return {
          description: 'Services de nettoyage personnalisés selon vos besoins',
          features: [
            'Devis personnalisé',
            'Adaptation aux besoins',
            'Service sur mesure',
            'Matériel adapté',
            'Équipe qualifiée'
          ],
          duration: 'Variable',
          priceRange: 'Sur devis - Dépend du type de service et de la surface'
        };
      case 'shampooinage-sieges':
        return {
          description: 'Nettoyage des sièges de véhicule',
          features: [
            'Shampooinage à la vapeur',
            'Élimination des taches',
            'Désodorisation',
            'Séchage professionnel',
            'Produits spécialisés'
          ],
          duration: '1-2 heures',
          priceRange: '20 CHF par siège'
        };
      case 'nettoyage-toiture':
        return {
          description: 'Nettoyage de toiture avec matériel spécialisé',
          features: [
            'Nettoyage haute pression',
            'Démoussage complet',
            'Traitement anti-mousse',
            'Évacuation des débris',
            'Respect des normes de sécurité'
          ],
          duration: '1 journée',
          priceRange: 'Sur devis - Dépend de la surface, du type de toiture et de l\'accessibilité'
        };
      case 'nettoyage-billard':
        return {
          description: 'Nettoyage professionnel du tapis de billard',
          features: [
            'Aspiration en douceur',
            'Nettoyage spécialisé feutrine',
            'Élimination poussière craie',
            'Préservation qualité jeu',
            'Matériel professionnel'
          ],
          duration: '1 heure',
          priceRange: '130 CHF'
        };
      default:
        return {
          description: service.description,
          features: [
            'Service professionnel',
            'Matériel de qualité',
            'Techniciens expérimentés',
            'Garantie satisfaction'
          ],
          duration: '1-2 heures',
          priceRange: 'Sur devis'
        };
    }
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
              <span>{service.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 px-1">
            <p className="text-gray-600">{details.description}</p>

            {/* Pack selection for vehicle service */}
            {service.id === 'nettoyage-vehicule' && (
              <div>
                <h4 className="font-medium mb-3">Nos forfaits</h4>
                <div className="space-y-2">
                  {Object.entries(packs).map(([packType, packData]) => (
                    <Collapsible key={packType}>
                      <CollapsibleTrigger 
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedPack(selectedPack === packType ? null : packType)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">Pack {packType}</span>
                          
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
                <h4 className="font-medium mb-2">Prestations incluses</h4>
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
                <span className="text-gray-600">Prix:</span>
                <span className="font-medium">{details.priceRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Durée:</span>
                <span className="font-medium">{details.duration}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white pt-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 min-h-[44px]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 min-h-[44px]"
              >
                Fermer
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