import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehiculeDetailsProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const VehiculeDetails = ({ onDataChange, onNext, onBack, initialData }: VehiculeDetailsProps) => {
  const [vehicleType, setVehicleType] = useState<string>(initialData?.vehicleType || '');
  const [selectedPack, setSelectedPack] = useState<string>(initialData?.pack || '');
  const [poilsAnimaux, setPoilsAnimaux] = useState<boolean>(initialData?.poilsAnimaux || false);
  const [traitementOzone, setTraitementOzone] = useState<boolean>(initialData?.traitementOzone || false);
  const [nettoyageExterieur, setNettoyageExterieur] = useState<boolean>(initialData?.nettoyageExterieur || false);
  const [priseElectrique, setPriseElectrique] = useState<string>(initialData?.priseElectrique || '');
  const [accesMobile, setAccesMobile] = useState<string>(initialData?.accesMobile || '');

  // Prix par type de véhicule et pack
  const vehiclePricing = {
    petite: {
      M: { price: 70, duration: '1h' },
      L: { price: 110, duration: '2h' },
      Premium: { price: 160, duration: '3h' }
    },
    moyenne: {
      M: { price: 80, duration: '1h30' },
      L: { price: 120, duration: '2h30' },
      Premium: { price: 180, duration: '4h' }
    },
    grande: {
      M: { price: 100, duration: '2h' },
      L: { price: 140, duration: '3h' },
      Premium: { price: 220, duration: '5h' }
    }
  };

  const optionPrices = {
    poilsAnimaux: 10,
    traitementOzone: 80,
    nettoyageExterieur: 70
  };

  // Fonction pour mettre à jour les données
  const updateData = () => {
    const data = {
      vehicleType,
      pack: selectedPack,
      poilsAnimaux,
      traitementOzone,
      nettoyageExterieur,
      priseElectrique,
      accesMobile,
      totalPrice: calculateTotal()
    };
    onDataChange(data);
  };

  // Gestionnaires d'événements
  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    // Reset pack selection when vehicle type changes
    setSelectedPack('');
  };

  const handlePackChange = (value: string) => {
    setSelectedPack(value);
  };

  const handleOptionChange = (option: string, value: boolean) => {
    switch (option) {
      case 'poilsAnimaux':
        setPoilsAnimaux(value);
        break;
      case 'traitementOzone':
        setTraitementOzone(value);
        break;
      case 'nettoyageExterieur':
        setNettoyageExterieur(value);
        break;
    }
  };

  const handlePriseElectriqueChange = (value: string) => {
    setPriseElectrique(value);
  };

  const handleAccesMobileChange = (value: string) => {
    setAccesMobile(value);
  };

  // Validation du formulaire
  const isFormValid = vehicleType && selectedPack && priseElectrique && accesMobile;

  // Calcul du total
  const calculateTotal = () => {
    let total = 0;
    
    if (vehicleType && selectedPack && vehiclePricing[vehicleType as keyof typeof vehiclePricing]) {
      const pricing = vehiclePricing[vehicleType as keyof typeof vehiclePricing];
      total += pricing[selectedPack as keyof typeof pricing]?.price || 0;
    }
    
    if (poilsAnimaux) total += optionPrices.poilsAnimaux;
    if (traitementOzone) total += optionPrices.traitementOzone;
    if (nettoyageExterieur) total += optionPrices.nettoyageExterieur;
    
    return total;
  };

  // Mettre à jour les données à chaque changement
  useEffect(() => {
    updateData();
  }, [vehicleType, selectedPack, poilsAnimaux, traitementOzone, nettoyageExterieur, priseElectrique, accesMobile]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nettoyage de véhicule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Nous proposons trois catégories de véhicules (Petite, Moyenne et Grande) et trois niveaux de formules (Pack M, Pack L et Pack Premium), adaptés à vos besoins et au temps consacré au nettoyage.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Type de véhicule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={vehicleType} onValueChange={handleVehicleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petite">Petite voiture</SelectItem>
              <SelectItem value="moyenne">Moyenne voiture</SelectItem>
              <SelectItem value="grande">Grande voiture (SUV/Van)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {vehicleType && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre formule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(vehiclePricing[vehicleType as keyof typeof vehiclePricing] || {}).map(([pack, info]) => (
                <div
                  key={pack}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPack === pack ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePackChange(pack)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Pack {pack}</h4>
                      <p className="text-sm text-gray-600">Durée: {info.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">CHF {info.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Pack M :</strong> nettoyage complet de base, rapide et efficace (durée la plus courte).</p>
              <p><strong>Pack L :</strong> nettoyage approfondi avec plus de détails (durée intermédiaire).</p>
              <p><strong>Pack Premium :</strong> formule la plus complète avec un nettoyage minutieux et un rendu optimal (durée la plus longue).</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Services complémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="poilsAnimaux" 
              checked={poilsAnimaux}
              onCheckedChange={(checked) => handleOptionChange('poilsAnimaux', checked as boolean)}
            />
            <label htmlFor="poilsAnimaux" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Poils d'animaux (+CHF 10)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="traitementOzone" 
              checked={traitementOzone}
              onCheckedChange={(checked) => handleOptionChange('traitementOzone', checked as boolean)}
            />
            <label htmlFor="traitementOzone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Traitement à l'Ozone (désinfection en profondeur) (+CHF 80)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="nettoyageExterieur" 
              checked={nettoyageExterieur}
              onCheckedChange={(checked) => handleOptionChange('nettoyageExterieur', checked as boolean)}
            />
            <label htmlFor="nettoyageExterieur" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nettoyage extérieur (+CHF 70)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions obligatoires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Y a-t-il une prise électrique accessible près du véhicule ? *
            </label>
            <Select value={priseElectrique} onValueChange={handlePriseElectriqueChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oui">Oui</SelectItem>
                <SelectItem value="non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Notre équipe mobile peut-elle accéder facilement au véhicule ? *
            </label>
            <Select value={accesMobile} onValueChange={handleAccesMobileChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oui">Oui, accès facile</SelectItem>
                <SelectItem value="difficile">Accès difficile</SelectItem>
                <SelectItem value="impossible">Accès impossible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {vehicleType && selectedPack && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-800">
                Total estimé: CHF {calculateTotal()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isFormValid}
          className="px-8"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default VehiculeDetails;