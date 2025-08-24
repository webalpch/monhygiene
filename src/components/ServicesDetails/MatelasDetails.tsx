import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingInfo } from './shared/PricingInfo';

interface MatelasDetailsProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const MatelasDetails = ({ onDataChange, onNext, onBack, initialData }: MatelasDetailsProps) => {
  const { t } = useLanguage();
  const [taille, setTaille] = useState<string>(initialData?.taille || '');

  const tarifs = {
    '90-120cm': 95,
    '140-160cm': 135,
    '180-200cm': 145
  };

  const handleTailleChange = (value: string) => {
    setTaille(value);
    onDataChange({
      type: 'matelas',
      taille: value,
      price: tarifs[value as keyof typeof tarifs]
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage de matelas à domicile
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de matelas directement chez vous
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
              <li>• Nettoyage complet des deux faces du matelas</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Nettoyage en profondeur des deux faces</li>
              <li>✔️ Élimination des taches et allergènes</li>
              <li>✔️ Suppression des mauvaises odeurs</li>
              <li>✔️ Désinfection à la vapeur haute température</li>
              <li>✔️ Application d'un parfum frais</li>
              <li>✔️ Produits écologiques</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💰 Tarifs selon la taille du matelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille du matelas *
              </label>
              <Select value={taille} onValueChange={handleTailleChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez la taille du matelas" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tarifs).map(([size, tarif]) => (
                    <SelectItem key={size} value={size} className="cursor-pointer">
                      {size} - {tarif} CHF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {taille && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-800">
                  Prix total: {tarifs[taille as keyof typeof tarifs]} CHF
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
            <li>✨ Matelas propre, rafraîchi et comme neuf</li>
            <li>🛡️ Allongement de la durée de vie du matelas</li>
            <li>😴 Sommeil plus sain et hygiène optimale</li>
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
        
        {taille && (
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

export default MatelasDetails;