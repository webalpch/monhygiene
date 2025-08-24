import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MoquetteTapisDetailsProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const MoquetteTapisDetails = ({ onDataChange, onNext, onBack, initialData }: MoquetteTapisDetailsProps) => {
  const [surface, setSurface] = useState<string>(initialData?.surface || '');
  const [typeTapis, setTypeTapis] = useState<string>(initialData?.typeTapis || '');
  const [degreEncrassement, setDegreEncrassement] = useState<string>(initialData?.degreEncrassement || '');
  const [traitementDesodorisant, setTraitementDesodorisant] = useState<boolean>(initialData?.traitementDesodorisant || false);

  const updateData = () => {
    onDataChange({
      type: 'moquette-tapis',
      surface,
      typeTapis,
      degreEncrassement,
      traitementDesodorisant
    });
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurface(e.target.value);
    setTimeout(updateData, 0);
  };

  const handleTypeTapisChange = (value: string) => {
    setTypeTapis(value);
    setTimeout(updateData, 0);
  };

  const handleDegreEncrassementChange = (value: string) => {
    setDegreEncrassement(value);
    setTimeout(updateData, 0);
  };

  const handleTraitementDesodorisantChange = (checked: boolean) => {
    setTraitementDesodorisant(checked);
    setTimeout(updateData, 0);
  };

  const isFormValid = surface && typeTapis && degreEncrassement;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage moquettes / tapis
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de moquettes et tapis
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
              <li>• Faites une demande de devis en ligne</li>
              <li>• Nous évaluons vos besoins et la surface</li>
              <li>• Notre équipe se rend sur place avec le matériel</li>
              <li>• Nettoyage en profondeur de vos moquettes/tapis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Aspiration en profondeur</li>
              <li>✔️ Traitement des taches tenaces</li>
              <li>✔️ Nettoyage à l'eau chaude</li>
              <li>✔️ Séchage accéléré</li>
              <li>✔️ Option désodorisation</li>
              <li>✔️ Produits écologiques</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📋 Tarification sur devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface estimée (m²) *
              </label>
              <Input
                type="number"
                placeholder="Ex: 25"
                value={surface}
                onChange={handleSurfaceChange}
                min="1"
                className="cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de tapis/moquette *
              </label>
              <Select value={typeTapis} onValueChange={handleTypeTapisChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moquette-synthetique" className="cursor-pointer">Moquette synthétique</SelectItem>
                  <SelectItem value="moquette-laine" className="cursor-pointer">Moquette en laine</SelectItem>
                  <SelectItem value="tapis-persan" className="cursor-pointer">Tapis persan</SelectItem>
                  <SelectItem value="tapis-moderne" className="cursor-pointer">Tapis moderne</SelectItem>
                  <SelectItem value="autre" className="cursor-pointer">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degré d'encrassement *
              </label>
              <Select value={degreEncrassement} onValueChange={handleDegreEncrassementChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le degré d'encrassement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible" className="cursor-pointer">Faible</SelectItem>
                  <SelectItem value="moyen" className="cursor-pointer">Moyen</SelectItem>
                  <SelectItem value="fort" className="cursor-pointer">Fort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="traitementDesodorisant"
                checked={traitementDesodorisant}
                onCheckedChange={handleTraitementDesodorisantChange}
                className="cursor-pointer"
              />
              <label htmlFor="traitementDesodorisant" className="text-sm font-medium cursor-pointer">
                Option traitement désodorisant
              </label>
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
            <li>✨ Moquettes et tapis comme neufs</li>
            <li>🏠 Service à domicile professionnel</li>
            <li>💚 Produits respectueux de l'environnement</li>
            <li>🔧 Matériel professionnel de pointe</li>
            <li>💯 Devis gratuit et transparent</li>
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

export default MoquetteTapisDetails;