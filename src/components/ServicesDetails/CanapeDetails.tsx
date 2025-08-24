import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingInfo } from './shared/PricingInfo';

interface CanapeDetailsProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const CanapeDetails = ({ onDataChange, onNext, onBack, initialData }: CanapeDetailsProps) => {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<string>(initialData?.places || '');

  const tarifs = {
    '1': 50,
    '2': 100,
    '3': 140,
    '4': 180,
    '5': 220,
    '6': 260,
    '7': 300
  };

  const handlePlacesChange = (value: string) => {
    setPlaces(value);
    onDataChange({
      type: 'canape',
      places: value,
      price: tarifs[value as keyof typeof tarifs]
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage de canapé à domicile
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de canapé directement chez vous
        </p>
      </div>

      <PricingInfo />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ Comment ça marche</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Réservez en ligne en quelques clics</li>
              <li>• Nous vous contactons pour confirmer les détails</li>
              <li>• Notre équipe se rend chez vous avec le matériel professionnel</li>
              <li>• Nettoyage complet avec séchage accéléré</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Aspiration complète</li>
              <li>✔️ Pré-traitement des taches</li>
              <li>✔️ Nettoyage à l'eau chaude</li>
              <li>✔️ Désinfection à la vapeur</li>
              <li>✔️ Séchage accéléré</li>
              <li>✔️ Produits écologiques</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💰 Tarifs selon le nombre de places</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de places *
              </label>
              <Select value={places} onValueChange={handlePlacesChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le nombre de places" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tarifs).map(([place, tarif]) => (
                    <SelectItem key={place} value={place} className="cursor-pointer">
                      {place} place{place !== '1' ? 's' : ''} - {tarif} CHF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {places && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-800">
                  Prix total: {tarifs[places as keyof typeof tarifs]} CHF
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Vos avantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✨ Canapé comme neuf, propre et rafraîchi</li>
            <li>🛡️ Préservation des matériaux et des couleurs</li>
            <li>🧘 Meilleure hygiène de votre espace de vie</li>
            <li>🏠 Service à domicile, pas besoin de transporter</li>
            <li>💚 Produits respectueux de l'environnement</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 text-lg rounded-2xl"
        >
          Retour
        </Button>
        
        {places && (
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

export default CanapeDetails;