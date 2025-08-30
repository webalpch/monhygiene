import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Service } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceFormModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: Service, formData: Record<string, any>, price: number) => void;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ 
  service, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  if (!service) return null;

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    switch (service.id) {
      case 'nettoyage-vehicule':
        const vehicleType = formData.vehicleType || 'moyenne';
        const pack = formData.pack;
        
        const pricing = {
          petite: { M: 70, L: 110, Premium: 160 },
          moyenne: { M: 80, L: 120, Premium: 180 },
          grande: { M: 100, L: 140, Premium: 220 }
        };
        
        let vehiclePrice = pricing[vehicleType as keyof typeof pricing]?.[pack as keyof typeof pricing.moyenne] || 0;
        
        // Add additional services
        if (formData.poilsAnimaux) vehiclePrice += 10;
        if (formData.traitementOzone) vehiclePrice += 80;
        if (formData.nettoyageExterieur) vehiclePrice += 70;
        
        return vehiclePrice;

      case 'nettoyage-canape':
        const seats = parseInt(formData.numberOfSeats) || 1;
        const canapePrices = { 1: 50, 2: 100, 3: 140, 4: 180, 5: 220, 6: 260, 7: 300 };
        return canapePrices[seats as keyof typeof canapePrices] || 50;

      case 'nettoyage-matelas':
        const matressSize = formData.matressSize || '90-120';
        const matelasPrices = { 
          '90-120': 95, 
          '140-160': 135, 
          '180-200': 145 
        };
        return matelasPrices[matressSize as keyof typeof matelasPrices] || 95;

      case 'nettoyage-domicile':
        const rooms = parseInt(formData.numberOfRooms) || 3;
        let homePrice = rooms * 50;
        if (formData.hasDeepCleaning) homePrice += 100;
        if (formData.hasWindowCleaning) homePrice += 80;
        return homePrice;

      case 'nettoyage-bureaux':
        const surface = parseInt(formData.surface) || 100;
        let officePrice = Math.max(surface * 2, 150); // Minimum 150 CHF
        if (formData.frequency === 'weekly') officePrice *= 0.8; // 20% discount
        return Math.round(officePrice);

      case 'nettoyage-terrasse':
      case 'nettoyage-toiture':
      case 'autres-services':
      case 'nettoyage-vitres':
      case 'nettoyage-moquette-tapis':
        return 0; // Prix sur devis

      case 'shampooinage-sieges':
        const numberOfSeats = parseInt(formData.numberOfSeats) || 1;
        return numberOfSeats * 20; // 20 CHF par siège

      default:
        return 100;
    }
  };

  const isFormValid = () => {
    switch (service.id) {
      case 'nettoyage-vehicule':
        return formData.vehicleType && formData.pack; // Type véhicule et pack obligatoires
      case 'nettoyage-canape':
        return formData.numberOfSeats; // Nombre de places obligatoire
      case 'nettoyage-matelas':
        return formData.matressSize; // Taille obligatoire
      case 'nettoyage-domicile':
        return formData.numberOfRooms; // Nombre de pièces obligatoire
      case 'nettoyage-bureaux':
        return formData.surface && formData.frequency; // Surface et fréquence obligatoires
      case 'nettoyage-terrasse':
        return formData.surfaceType; // Type de revêtement obligatoire
      case 'shampooinage-sieges':
        return formData.numberOfSeats; // Nombre de sièges obligatoire
      case 'nettoyage-toiture':
      case 'autres-services':
      case 'nettoyage-vitres':
      case 'nettoyage-moquette-tapis':
        return true; // Services sur devis, pas de validation particulière
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return; // Ne pas soumettre si le formulaire n'est pas valide
    }
    const price = calculatePrice();
    onSubmit(service, formData, price);
  };

  const renderForm = () => {
    switch (service.id) {
      case 'nettoyage-vehicule':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicleType">Type de véhicule *</Label>
              <Select onValueChange={(value) => updateFormData('vehicleType', value)} value={formData.vehicleType}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez le type de véhicule..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="petite">Petite voiture (Ex. Fiat panda)</SelectItem>
                  <SelectItem value="moyenne">Moyenne voiture</SelectItem>
                  <SelectItem value="grande">Grande voiture (SUV/Van)</SelectItem>
                </SelectContent>
              </Select>
              {!formData.vehicleType && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner le type de véhicule</p>
              )}
            </div>

            {formData.vehicleType && (
              <div>
                <Label htmlFor="pack">Forfait *</Label>
                <Select onValueChange={(value) => updateFormData('pack', value)} value={formData.pack}>
                  <SelectTrigger className="bg-white border-2 z-50">
                    <SelectValue placeholder="Sélectionnez un pack..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-lg z-50">
                    {formData.vehicleType === 'petite' && (
                      <>
                        <SelectItem value="M">Pack M - 70 CHF (1h)</SelectItem>
                        <SelectItem value="L">Pack L - 110 CHF (2h)</SelectItem>
                        <SelectItem value="Premium">Pack Premium - 160 CHF (3h)</SelectItem>
                      </>
                    )}
                    {formData.vehicleType === 'moyenne' && (
                      <>
                        <SelectItem value="M">Pack M - 80 CHF (1h30)</SelectItem>
                        <SelectItem value="L">Pack L - 120 CHF (2h30)</SelectItem>
                        <SelectItem value="Premium">Pack Premium - 180 CHF (4h)</SelectItem>
                      </>
                    )}
                    {formData.vehicleType === 'grande' && (
                      <>
                        <SelectItem value="M">Pack M - 100 CHF (2h)</SelectItem>
                        <SelectItem value="L">Pack L - 140 CHF (3h)</SelectItem>
                        <SelectItem value="Premium">Pack Premium - 220 CHF (5h)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {!formData.pack && (
                  <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner un pack</p>
                )}
              </div>
            )}

            {formData.pack && (
              <div className="space-y-3">
                <Label>Services complémentaires</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="poilsAnimaux"
                    checked={formData.poilsAnimaux}
                    onCheckedChange={(checked) => updateFormData('poilsAnimaux', checked)}
                  />
                  <Label htmlFor="poilsAnimaux">Poils d'animaux (+10 CHF)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="traitementOzone"
                    checked={formData.traitementOzone}
                    onCheckedChange={(checked) => updateFormData('traitementOzone', checked)}
                  />
                  <Label htmlFor="traitementOzone">Traitement à l'Ozone (+80 CHF)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nettoyageExterieur"
                    checked={formData.nettoyageExterieur}
                    onCheckedChange={(checked) => updateFormData('nettoyageExterieur', checked)}
                  />
                  <Label htmlFor="nettoyageExterieur">Nettoyage extérieur (+70 CHF)</Label>
                </div>
              </div>
            )}
          </div>
        );

      case 'nettoyage-canape':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfSeats">Nombre de places *</Label>
              <Select onValueChange={(value) => updateFormData('numberOfSeats', value)} value={formData.numberOfSeats}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="1">1 place (50 CHF)</SelectItem>
                  <SelectItem value="2">2 places (100 CHF)</SelectItem>
                  <SelectItem value="3">3 places (140 CHF)</SelectItem>
                  <SelectItem value="4">4 places (180 CHF)</SelectItem>
                  <SelectItem value="5">5 places (220 CHF)</SelectItem>
                  <SelectItem value="6">6 places (260 CHF)</SelectItem>
                  <SelectItem value="7">7 places (300 CHF)</SelectItem>
                </SelectContent>
              </Select>
              {!formData.numberOfSeats && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner le nombre de places</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-matelas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="matressSize">Taille du matelas *</Label>
              <Select onValueChange={(value) => updateFormData('matressSize', value)} value={formData.matressSize}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="90-120">90-120 cm (95 CHF)</SelectItem>
                  <SelectItem value="140-160">140-160 cm (135 CHF)</SelectItem>
                  <SelectItem value="180-200">180-200 cm (145 CHF)</SelectItem>
                </SelectContent>
              </Select>
              {!formData.matressSize && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner la taille du matelas</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-domicile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfRooms">Nombre de pièces *</Label>
              <Input
                type="number"
                id="numberOfRooms"
                placeholder="Nombre de pièces"
                value={formData.numberOfRooms || ''}
                onChange={(e) => updateFormData('numberOfRooms', e.target.value)}
              />
              {!formData.numberOfRooms && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez indiquer le nombre de pièces</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDeepCleaning"
                checked={formData.hasDeepCleaning}
                onCheckedChange={(checked) => updateFormData('hasDeepCleaning', checked)}
              />
              <Label htmlFor="hasDeepCleaning">Nettoyage en profondeur (+100 CHF)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWindowCleaning"
                checked={formData.hasWindowCleaning}
                onCheckedChange={(checked) => updateFormData('hasWindowCleaning', checked)}
              />
              <Label htmlFor="hasWindowCleaning">Nettoyage des vitres (+80 CHF)</Label>
            </div>
          </div>
        );

      case 'nettoyage-bureaux':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surface">Surface (m²) *</Label>
              <Input
                type="number"
                id="surface"
                placeholder="Surface en m²"
                value={formData.surface || ''}
                onChange={(e) => updateFormData('surface', e.target.value)}
              />
              {!formData.surface && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez indiquer la surface</p>
              )}
            </div>

            <div>
              <Label htmlFor="frequency">Fréquence *</Label>
              <Select onValueChange={(value) => updateFormData('frequency', value)} value={formData.frequency}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="once">Une seule fois</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire (-20%)</SelectItem>
                  <SelectItem value="biweekly">Bi-hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                </SelectContent>
              </Select>
              {!formData.frequency && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner la fréquence</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-terrasse':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surfaceType">Type de revêtement *</Label>
              <Input
                type="text"
                id="surfaceType"
                placeholder="Type de revêtement"
                value={formData.surfaceType || ''}
                onChange={(e) => updateFormData('surfaceType', e.target.value)}
              />
              {!formData.surfaceType && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez indiquer le type de revêtement</p>
              )}
            </div>
          </div>
        );

      case 'shampooinage-sieges':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfSeats">Nombre de sièges *</Label>
              <Input
                type="number"
                id="numberOfSeats"
                placeholder="Nombre de sièges"
                value={formData.numberOfSeats || ''}
                onChange={(e) => updateFormData('numberOfSeats', e.target.value)}
              />
              {!formData.numberOfSeats && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez indiquer le nombre de sièges</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-toiture':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="roofType">Type de toiture</Label>
              <Input
                type="text"
                id="roofType"
                placeholder="Type de toiture"
                value={formData.roofType || ''}
                onChange={(e) => updateFormData('roofType', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="roofSurface">Surface de la toiture (m²)</Label>
              <Input
                type="number"
                id="roofSurface"
                placeholder="Surface en m²"
                value={formData.roofSurface || ''}
                onChange={(e) => updateFormData('roofSurface', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accessDifficulty">Difficulté d'accès</Label>
              <Textarea
                id="accessDifficulty"
                placeholder="Décrivez la difficulté d'accès"
                value={formData.accessDifficulty || ''}
                onChange={(e) => updateFormData('accessDifficulty', e.target.value)}
              />
            </div>
          </div>
        );

      case 'autres-services':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceDescription">Description du service souhaité</Label>
              <Textarea
                id="serviceDescription"
                placeholder="Décrivez le service que vous recherchez"
                value={formData.serviceDescription || ''}
                onChange={(e) => updateFormData('serviceDescription', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="surfaceArea">Surface à nettoyer (m²)</Label>
              <Input
                type="number"
                id="surfaceArea"
                placeholder="Surface en m²"
                value={formData.surfaceArea || ''}
                onChange={(e) => updateFormData('surfaceArea', e.target.value)}
              />
            </div>
          </div>
        );

      case 'nettoyage-vitres':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfWindows">Nombre de fenêtres</Label>
              <Input
                type="number"
                id="numberOfWindows"
                placeholder="Nombre de fenêtres"
                value={formData.numberOfWindows || ''}
                onChange={(e) => updateFormData('numberOfWindows', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="windowType">Type de fenêtres</Label>
              <Input
                type="text"
                id="windowType"
                placeholder="Type de fenêtres"
                value={formData.windowType || ''}
                onChange={(e) => updateFormData('windowType', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accessDifficulty">Difficulté d'accès</Label>
              <Textarea
                id="accessDifficulty"
                placeholder="Décrivez la difficulté d'accès"
                value={formData.accessDifficulty || ''}
                onChange={(e) => updateFormData('accessDifficulty', e.target.value)}
              />
            </div>
          </div>
        );

      case 'nettoyage-moquette-tapis':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surfaceArea">Surface (m²)</Label>
              <Input
                type="number"
                id="surfaceArea"
                placeholder="Surface en m²"
                value={formData.surfaceArea || ''}
                onChange={(e) => updateFormData('surfaceArea', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="materialType">Type de matériau</Label>
              <Input
                type="text"
                id="materialType"
                placeholder="Type de matériau"
                value={formData.materialType || ''}
                onChange={(e) => updateFormData('materialType', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stainDescription">Description des taches</Label>
              <Textarea
                id="stainDescription"
                placeholder="Décrivez les taches"
                value={formData.stainDescription || ''}
                onChange={(e) => updateFormData('stainDescription', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] mx-2 sm:mx-auto flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Configuration - {service.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 scrollbar-thin scrollbar-thumb-primary/20">
          <div className="space-y-4 sm:space-y-6">
            {renderForm()}

            {calculatePrice() > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Prix estimé:</span>
                  <span className="font-bold text-green-800 text-lg">{calculatePrice()} CHF</span>
                </div>
              </div>
            )}
            
            {calculatePrice() === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-blue-800 text-sm font-medium">
                  Prix sur devis - Nous vous contacterons pour établir un devis personnalisé.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-0 border-t bg-white">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 min-h-[44px]"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid()}
            className="flex-1 min-h-[44px]"
          >
            {!isFormValid() ? 'Sélectionnez les options obligatoires' : 'Ajouter au panier'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
