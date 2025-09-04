import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShampooinageSiegesProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const ShampooinageSieges = ({ onDataChange, onNext, onBack, initialData }: ShampooinageSiegesProps) => {
  const [nombreSieges, setNombreSieges] = useState<string>(initialData?.nombreSieges || '');
  const [priseElectrique, setPriseElectrique] = useState<string>(initialData?.priseElectrique || '');
  const [accesMobile, setAccesMobile] = useState<string>(initialData?.accesMobile || '');

  const tarifParSiege = 20;

  const updateData = () => {
    const totalPrice = nombreSieges ? parseInt(nombreSieges) * tarifParSiege : 0;
    onDataChange({
      type: 'shampooinage',
      nombreSieges,
      priseElectrique,
      accesMobile,
      price: totalPrice
    });
  };

  const handleNombreSiegesChange = (value: string) => {
    setNombreSieges(value);
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

  const isFormValid = nombreSieges && priseElectrique && accesMobile;

  const calculateTotal = () => {
    return nombreSieges ? parseInt(nombreSieges) * tarifParSiege : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Shampooinage des sièges
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de shampooinage de sièges de véhicule
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
              <li>• Réservez en ligne en spécifiant le nombre de sièges</li>
              <li>• Nous vous contactons pour confirmer les détails</li>
              <li>• Notre équipe se rend chez vous avec le matériel</li>
              <li>• Shampooinage professionnel de vos sièges</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Shampooinage en profondeur</li>
              <li>✔️ Élimination des taches</li>
              <li>✔️ Désinfection et désodorisation</li>
              <li>✔️ Séchage professionnel</li>
              <li>✔️ Produits écologiques</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💰 Tarif : 20 CHF par siège (minimum 4 sièges)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de sièges *
              </label>
              <Select value={nombreSieges} onValueChange={handleNombreSiegesChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le nombre de sièges" />
                </SelectTrigger>
                <SelectContent>
                  {[4, 5, 6, 7, 8, 9, 10].map((nb) => (
                    <SelectItem key={nb} value={nb.toString()} className="cursor-pointer">
                      {nb} siège{nb > 1 ? 's' : ''} - {nb * tarifParSiege} CHF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {nombreSieges && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-800">
                  Prix total: {calculateTotal()} CHF
                </p>
              </div>
            )}
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

      <Card>
        <CardHeader>
          <CardTitle>🎯 Vos avantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✨ Sièges propres et rafraîchis</li>
            <li>🚗 Service à domicile, pas besoin de se déplacer</li>
            <li>💚 Produits respectueux de l'environnement</li>
            <li>🔧 Matériel professionnel de pointe</li>
            <li>💯 Résultat garanti</li>
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

export default ShampooinageSieges;