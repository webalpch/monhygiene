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
        let vehiclePrice = 80; // Base price for Pack M
        if (formData.pack === 'L') vehiclePrice = 120;
        if (formData.pack === 'Premium') vehiclePrice = 180;
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
        return formData.pack; // Pack obligatoire
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
              <Label htmlFor="pack">Forfait *</Label>
              <Select onValueChange={(value) => updateFormData('pack', value)} value={formData.pack}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez un pack..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="M">Pack M - 80 CHF</SelectItem>
                  <SelectItem value="L">Pack L - 120 CHF</SelectItem>
                  <SelectItem value="Premium">Pack Premium - 180 CHF</SelectItem>
                </SelectContent>
              </Select>
              {!formData.pack && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner un pack</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes spéciales</Label>
              <Textarea 
                id="notes"
                placeholder="Informations complémentaires..."
                onChange={(e) => updateFormData('notes', e.target.value)}
              />
            </div>
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
                  <SelectItem value="90-120">90 cm à 120 cm (95 CHF)</SelectItem>
                  <SelectItem value="140-160">140 cm à 160 cm (135 CHF)</SelectItem>
                  <SelectItem value="180-200">180 cm à 200 cm (145 CHF)</SelectItem>
                </SelectContent>
              </Select>
              {!formData.matressSize && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner la taille du matelas</p>
              )}
            </div>

            <div>
              <Label htmlFor="numberOfMatresses">Nombre de matelas</Label>
              <Input 
                id="numberOfMatresses"
                type="number"
                min="1"
                defaultValue="1"
                onChange={(e) => updateFormData('numberOfMatresses', e.target.value)}
              />
            </div>
          </div>
        );

      case 'nettoyage-domicile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfRooms">Nombre de pièces *</Label>
              <Input 
                id="numberOfRooms"
                type="number"
                min="1"
                placeholder="3"
                value={formData.numberOfRooms || ''}
                onChange={(e) => updateFormData('numberOfRooms', e.target.value)}
                className="bg-white border-2"
              />
              {!formData.numberOfRooms && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez indiquer le nombre de pièces</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="deepCleaning"
                onCheckedChange={(checked) => updateFormData('hasDeepCleaning', checked)}
              />
              <Label htmlFor="deepCleaning">Nettoyage en profondeur (+100 CHF)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="windowCleaning"
                onCheckedChange={(checked) => updateFormData('hasWindowCleaning', checked)}
              />
              <Label htmlFor="windowCleaning">Nettoyage des vitres (+80 CHF)</Label>
            </div>
          </div>
        );

      case 'nettoyage-bureaux':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surface">Surface en m² *</Label>
              <Input 
                id="surface"
                type="number"
                min="20"
                placeholder="100"
                value={formData.surface || ''}
                onChange={(e) => updateFormData('surface', e.target.value)}
                className="bg-white border-2"
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
                  <SelectItem value="one-time">Ponctuel</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire (-20%)</SelectItem>
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
              <Select onValueChange={(value) => updateFormData('surfaceType', value)} value={formData.surfaceType}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez le type de revêtement..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="bois">Bois</SelectItem>
                  <SelectItem value="pierre">Pierre</SelectItem>
                  <SelectItem value="carrelage">Carrelage</SelectItem>
                  <SelectItem value="beton">Béton</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {!formData.surfaceType && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner le type de revêtement</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium">
                Prix sur devis en fonction de la taille et de la surface de votre terrasse.
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notes spéciales</Label>
              <Textarea 
                id="notes"
                placeholder="Taille approximative, état de la terrasse, demandes spéciales..."
                onChange={(e) => updateFormData('notes', e.target.value)}
              />
            </div>
          </div>
        );

      case 'shampooinage-sieges':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfSeats">Nombre de sièges *</Label>
              <Select onValueChange={(value) => updateFormData('numberOfSeats', value)} value={formData.numberOfSeats}>
                <SelectTrigger className="bg-white border-2 z-50">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg z-50">
                  <SelectItem value="1">1 siège (20 CHF)</SelectItem>
                  <SelectItem value="2">2 sièges (40 CHF)</SelectItem>
                  <SelectItem value="3">3 sièges (60 CHF)</SelectItem>
                  <SelectItem value="4">4 sièges (80 CHF)</SelectItem>
                  <SelectItem value="5">5 sièges (100 CHF)</SelectItem>
                  <SelectItem value="6">6 sièges (120 CHF)</SelectItem>
                  <SelectItem value="7">7 sièges (140 CHF)</SelectItem>
                </SelectContent>
              </Select>
              {!formData.numberOfSeats && (
                <p className="text-red-500 text-sm mt-1">⚠️ Veuillez sélectionner le nombre de sièges</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes spéciales</Label>
              <Textarea 
                id="notes"
                placeholder="Type de véhicule, état des sièges, demandes spéciales..."
                onChange={(e) => updateFormData('notes', e.target.value)}
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
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle>Configuration - {service.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="space-y-6">
            {renderForm()}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Prix estimé:</span>
                <span className="text-primary">
                  {['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'].includes(service.id) 
                    ? 'Sur devis' 
                    : `${calculatePrice()} CHF`}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 sticky bottom-0 bg-white pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isFormValid()}
                className={`flex-1 ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {!isFormValid() ? 'Sélectionnez les options obligatoires' : 'Ajouter au panier'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};