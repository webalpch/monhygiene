import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToitureSpecifiqueProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const ToitureSpecifique = ({ onDataChange, onNext, onBack, initialData }: ToitureSpecifiqueProps) => {
  const [typeToiture, setTypeToiture] = useState<string>(initialData?.typeToiture || '');
  const [surface, setSurface] = useState<string>(initialData?.surface || '');
  const [accessibilite, setAccessibilite] = useState<string>(initialData?.accessibilite || '');
  const [degreSalissure, setDegreSalissure] = useState<string>(initialData?.degreSalissure || '');

  const updateData = () => {
    onDataChange({
      type: 'toiture',
      typeToiture,
      surface,
      accessibilite,
      degreSalissure
    });
  };

  const handleTypeToitureChange = (value: string) => {
    setTypeToiture(value);
    setTimeout(updateData, 0);
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurface(e.target.value);
    setTimeout(updateData, 0);
  };

  const handleAccessibiliteChange = (value: string) => {
    setAccessibilite(value);
    setTimeout(updateData, 0);
  };

  const handleDegreSalissureChange = (value: string) => {
    setDegreSalissure(value);
    setTimeout(updateData, 0);
  };

  const isFormValid = typeToiture && surface && accessibilite && degreSalissure;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage de toiture
        </h1>
        <p className="text-lg text-gray-600">
          Nettoyage et entretien professionnel de votre toiture
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
              <li>• Nous évaluons votre toiture et les accès</li>
              <li>• Notre équipe spécialisée se rend sur place</li>
              <li>• Nettoyage complet avec équipements sécurisés</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Nettoyage en profondeur avec matériel professionnel</li>
              <li>✔️ Élimination des mousses, lichens et débris</li>
              <li>✔️ Équipements de sécurité pour toutes interventions</li>
              <li>✔️ Respect des matériaux de couverture</li>
              <li>✔️ Option traitement préventif anti-mousse</li>
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
                Type de toiture *
              </label>
              <Select value={typeToiture} onValueChange={handleTypeToitureChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type de toiture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ardoise" className="cursor-pointer">Ardoise</SelectItem>
                  <SelectItem value="tuiles-terre-cuite" className="cursor-pointer">Tuiles terre cuite</SelectItem>
                  <SelectItem value="tuiles-beton" className="cursor-pointer">Tuiles béton</SelectItem>
                  <SelectItem value="metal" className="cursor-pointer">Métal</SelectItem>
                  <SelectItem value="autre" className="cursor-pointer">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface estimée (m²) *
              </label>
              <Input
                type="number"
                placeholder="Ex: 120"
                value={surface}
                onChange={handleSurfaceChange}
                min="1"
                className="cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessibilité *
              </label>
              <Select value={accessibilite} onValueChange={handleAccessibiliteChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez l'accessibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile" className="cursor-pointer">Facile</SelectItem>
                  <SelectItem value="moyenne" className="cursor-pointer">Moyenne</SelectItem>
                  <SelectItem value="difficile" className="cursor-pointer">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degré de salissure *
              </label>
              <Select value={degreSalissure} onValueChange={handleDegreSalissureChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le degré de salissure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible" className="cursor-pointer">Faible</SelectItem>
                  <SelectItem value="moyen" className="cursor-pointer">Moyen</SelectItem>
                  <SelectItem value="fort" className="cursor-pointer">Fort</SelectItem>
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
            <li>🏠 Toiture propre et protection optimale</li>
            <li>🛡️ Préservation des matériaux et étanchéité</li>
            <li>💰 Économies sur les réparations futures</li>
            <li>🔒 Intervention sécurisée par des professionnels</li>
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

export default ToitureSpecifique;