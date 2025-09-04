import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Service } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

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
              <Label htmlFor="vehicleType">{t('vehicleType')} *</Label>
              <Select onValueChange={(value) => updateFormData('vehicleType', value)} value={formData.vehicleType}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder={t('selectVehicleType')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="petite">{t('smallCar')}</SelectItem>
                  <SelectItem value="moyenne">{t('mediumCar')}</SelectItem>
                  <SelectItem value="grande">{t('largeCar')}</SelectItem>
                </SelectContent>
              </Select>
              {!formData.vehicleType && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseSelectVehicleType')}</p>
              )}
            </div>

            {formData.vehicleType && (
              <div>
                <Label htmlFor="pack">{t('package')} *</Label>
                <Select onValueChange={(value) => updateFormData('pack', value)} value={formData.pack}>
                  <SelectTrigger className="bg-white border-2 z-50">
                    <SelectValue placeholder={t('selectPackage')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-lg z-50">
                    {formData.vehicleType === 'petite' && (
                      <>
                        <SelectItem value="M">{t('packM')} - 70 CHF (1h)</SelectItem>
                        <SelectItem value="L">{t('packL')} - 110 CHF (2h)</SelectItem>
                        <SelectItem value="Premium">{t('packPremium')} - 160 CHF (3h)</SelectItem>
                      </>
                    )}
                    {formData.vehicleType === 'moyenne' && (
                      <>
                        <SelectItem value="M">{t('packM')} - 80 CHF (1h30)</SelectItem>
                        <SelectItem value="L">{t('packL')} - 120 CHF (2h30)</SelectItem>
                        <SelectItem value="Premium">{t('packPremium')} - 180 CHF (4h)</SelectItem>
                      </>
                    )}
                    {formData.vehicleType === 'grande' && (
                      <>
                        <SelectItem value="M">{t('packM')} - 100 CHF (2h)</SelectItem>
                        <SelectItem value="L">{t('packL')} - 140 CHF (3h)</SelectItem>
                        <SelectItem value="Premium">{t('packPremium')} - 220 CHF (5h)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {!formData.pack && (
                  <p className="text-red-500 text-sm mt-1">{t('pleaseSelectPackage')}</p>
                )}
              </div>
            )}

            {formData.pack && (
              <div className="space-y-3">
                <Label>{t('complementaryServices')}</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="poilsAnimaux"
                    checked={formData.poilsAnimaux}
                    onCheckedChange={(checked) => updateFormData('poilsAnimaux', checked)}
                  />
                  <Label htmlFor="poilsAnimaux">{t('animalHair')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="traitementOzone"
                    checked={formData.traitementOzone}
                    onCheckedChange={(checked) => updateFormData('traitementOzone', checked)}
                  />
                  <Label htmlFor="traitementOzone">{t('ozonetreatment')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nettoyageExterieur"
                    checked={formData.nettoyageExterieur}
                    onCheckedChange={(checked) => updateFormData('nettoyageExterieur', checked)}
                  />
                  <Label htmlFor="nettoyageExterieur">{t('exteriorCleaning')}</Label>
                </div>
              </div>
            )}
          </div>
        );

      case 'nettoyage-canape':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfSeats">{t('numberOfSeats')} *</Label>
              <Select onValueChange={(value) => updateFormData('numberOfSeats', value)} value={formData.numberOfSeats}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder={t('pleaseSelectNumberOfSeats')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="1">{t('seat1')}</SelectItem>
                  <SelectItem value="2">{t('seat2')}</SelectItem>
                  <SelectItem value="3">{t('seat3')}</SelectItem>
                  <SelectItem value="4">{t('seat4')}</SelectItem>
                  <SelectItem value="5">{t('seat5')}</SelectItem>
                  <SelectItem value="6">{t('seat6')}</SelectItem>
                  <SelectItem value="7">{t('seat7')}</SelectItem>
                </SelectContent>
              </Select>
              {!formData.numberOfSeats && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseSelectNumberOfSeats')}</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-matelas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="matressSize">{t('mattressSize')} *</Label>
              <Select onValueChange={(value) => updateFormData('matressSize', value)} value={formData.matressSize}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder={t('pleaseSelectMattressSize')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="90-120">{t('mattress90')}</SelectItem>
                  <SelectItem value="140-160">{t('mattress140')}</SelectItem>
                  <SelectItem value="180-200">{t('mattress180')}</SelectItem>
                </SelectContent>
              </Select>
              {!formData.matressSize && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseSelectMattressSize')}</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-domicile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfRooms">{t('numberOfRooms')} *</Label>
              <Input
                type="number"
                id="numberOfRooms"
                placeholder={t('numberOfRooms')}
                value={formData.numberOfRooms || ''}
                onChange={(e) => updateFormData('numberOfRooms', e.target.value)}
              />
              {!formData.numberOfRooms && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseEnterNumberOfRooms')}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDeepCleaning"
                checked={formData.hasDeepCleaning}
                onCheckedChange={(checked) => updateFormData('hasDeepCleaning', checked)}
              />
              <Label htmlFor="hasDeepCleaning">{t('deepCleaning')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWindowCleaning"
                checked={formData.hasWindowCleaning}
                onCheckedChange={(checked) => updateFormData('hasWindowCleaning', checked)}
              />
              <Label htmlFor="hasWindowCleaning">{t('windowCleaning')}</Label>
            </div>
          </div>
        );

      case 'nettoyage-bureaux':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surface">{t('surfaceArea')} *</Label>
              <Input
                type="number"
                id="surface"
                placeholder={t('surfaceArea')}
                value={formData.surface || ''}
                onChange={(e) => updateFormData('surface', e.target.value)}
              />
              {!formData.surface && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseEnterSurface')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="frequency">{t('frequency')} *</Label>
              <Select onValueChange={(value) => updateFormData('frequency', value)} value={formData.frequency}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder={t('pleaseSelectFrequency')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="once">{t('once')}</SelectItem>
                  <SelectItem value="weekly">{t('weekly')}</SelectItem>
                  <SelectItem value="biweekly">{t('biweekly')}</SelectItem>
                  <SelectItem value="monthly">{t('monthly')}</SelectItem>
                </SelectContent>
              </Select>
              {!formData.frequency && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseSelectFrequency')}</p>
              )}
            </div>
          </div>
        );

      case 'nettoyage-terrasse':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surfaceType">{t('surfaceType')} *</Label>
              <Input
                type="text"
                id="surfaceType"
                placeholder={t('surfaceType')}
                value={formData.surfaceType || ''}
                onChange={(e) => updateFormData('surfaceType', e.target.value)}
              />
              {!formData.surfaceType && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseEnterSurfaceType')}</p>
              )}
            </div>
          </div>
        );

      case 'shampooinage-sieges':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfSeats">{t('numberOfSeats')} *</Label>
              <Input
                type="number"
                id="numberOfSeats"
                placeholder={t('numberOfSeats')}
                value={formData.numberOfSeats || ''}
                onChange={(e) => updateFormData('numberOfSeats', e.target.value)}
              />
              {!formData.numberOfSeats && (
                <p className="text-red-500 text-sm mt-1">{t('pleaseSelectNumberOfSeats')}</p>
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
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] mx-4 sm:mx-auto flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Configuration - {service.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 scrollbar-thin scrollbar-thumb-primary/20">
          <div className="space-y-4 sm:space-y-6">
            {renderForm()}

            {calculatePrice() > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">{t('estimatedPrice')}:</span>
                  <span className="font-bold text-green-800 text-lg">{calculatePrice()} CHF</span>
                </div>
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
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid()}
            className="flex-1 min-h-[44px]"
          >
            {!isFormValid() ? t('selectToContinue') : t('addToCart')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
