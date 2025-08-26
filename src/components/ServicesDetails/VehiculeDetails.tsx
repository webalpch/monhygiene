import { useState } from 'react';
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
  const [pack, setPack] = useState<string>(initialData?.pack || '');
  const [shampooing, setShampooing] = useState<boolean>(initialData?.shampooing || false);
  const [lavageExterieur, setLavageExterieur] = useState<boolean>(initialData?.lavageExterieur || false);
  const [traitementOzone, setTraitementOzone] = useState<boolean>(initialData?.traitementOzone || false);
  const [priseElectrique, setPriseElectrique] = useState<string>(initialData?.priseElectrique || '');
  const [accesMobile, setAccesMobile] = useState<string>(initialData?.accesMobile || '');

  const packs = {
    'M': { name: 'Pack M', price: 80, description: 'Nettoyage intérieur standard' },
    'L': { name: 'Pack L', price: 120, description: 'Nettoyage intérieur complet' },
    'Premium': { name: 'Pack Premium', price: 180, description: 'Nettoyage intérieur premium avec finitions' }
  };

  const options = {
    shampooing: 30,
    lavageExterieur: 25,
    traitementOzone: 40
  };

  const updateData = () => {
    let totalPrice = pack ? packs[pack as keyof typeof packs].price : 0;
    if (shampooing) totalPrice += options.shampooing;
    if (lavageExterieur) totalPrice += options.lavageExterieur;
    if (traitementOzone) totalPrice += options.traitementOzone;

    onDataChange({
      type: 'vehicule',
      pack,
      shampooing,
      lavageExterieur,
      traitementOzone,
      priseElectrique,
      accesMobile,
      price: totalPrice
    });
  };

  const handlePackChange = (value: string) => {
    setPack(value);
    setTimeout(updateData, 0);
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    switch (option) {
      case 'shampooing':
        setShampooing(checked);
        break;
      case 'lavageExterieur':
        setLavageExterieur(checked);
        break;
      case 'traitementOzone':
        setTraitementOzone(checked);
        break;
    }
    setTimeout(updateData, 0);
  };

  const handlePriseElectriqueChange = (value: string) => {
    setPriseElectrique(value);
    setTimeout(updateData, 0);
  };

  const handleAccesMobileChange = (value: string) => {
    setAccesMobile(value);
    setTimeout(updateData, 0);
  };

  const isFormValid = pack && priseElectrique && accesMobile;

  const calculateTotal = () => {
    let total = pack ? packs[pack as keyof typeof packs].price : 0;
    if (shampooing) total += options.shampooing;
    if (lavageExterieur) total += options.lavageExterieur;
    if (traitementOzone) total += options.traitementOzone;
    return total;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage intérieur de véhicule
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de véhicule à domicile
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 font-medium">
          Gratuit dans un rayon de 5 km autour de Sion. Sinon, CHF 0.75/km (aller simple).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ Comment ça marche</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Réservez en ligne en sélectionnant votre pack</li>
              <li>• Nous vous contactons pour confirmer les détails</li>
              <li>• Notre équipe se rend chez vous avec le matériel</li>
              <li>• Nettoyage complet selon le pack choisi</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Vos avantages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✨ Véhicule propre et rafraîchi</li>
              <li>🚗 Service à domicile, pas besoin de se déplacer</li>
              <li>💚 Produits respectueux de l'environnement</li>
              <li>🔧 Matériel professionnel de pointe</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📦 Choisissez votre pack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pack de nettoyage *
              </label>
              <Select value={pack} onValueChange={handlePackChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez un pack" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(packs).map(([key, packInfo]) => (
                    <SelectItem key={key} value={key} className="cursor-pointer">
                      {packInfo.name} - {packInfo.price} CHF - {packInfo.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔧 Options supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shampooing"
                checked={shampooing}
                onCheckedChange={(checked) => handleOptionChange('shampooing', checked as boolean)}
                className="cursor-pointer"
              />
              <label htmlFor="shampooing" className="text-sm font-medium cursor-pointer">
                Shampooinage des sièges (+{options.shampooing} CHF)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lavageExterieur"
                checked={lavageExterieur}
                onCheckedChange={(checked) => handleOptionChange('lavageExterieur', checked as boolean)}
                className="cursor-pointer"
              />
              <label htmlFor="lavageExterieur" className="text-sm font-medium cursor-pointer">
                Lavage extérieur (+{options.lavageExterieur} CHF)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="traitementOzone"
                checked={traitementOzone}
                onCheckedChange={(checked) => handleOptionChange('traitementOzone', checked as boolean)}
                className="cursor-pointer"
              />
              <label htmlFor="traitementOzone" className="text-sm font-medium cursor-pointer">
                Traitement ozone (+{options.traitementOzone} CHF)
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>❓ Questions obligatoires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avez-vous une prise électrique à moins de 40 m ? *
              </label>
              <Select value={priseElectrique} onValueChange={handlePriseElectriqueChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez une réponse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui" className="cursor-pointer">Oui</SelectItem>
                  <SelectItem value="non" className="cursor-pointer">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peut-on bouger librement autour du véhicule pour nettoyer ? *
              </label>
              <Select value={accesMobile} onValueChange={handleAccesMobileChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez une réponse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui" className="cursor-pointer">Oui</SelectItem>
                  <SelectItem value="non" className="cursor-pointer">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {pack && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-medium text-green-800">
            Prix total: {calculateTotal()} CHF
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 text-lg rounded-2xl"
        >
          Retour
        </Button>
        
        {isFormValid && (
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-2xl"
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehiculeDetails;