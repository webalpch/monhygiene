import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TerrasseSpecifiqueProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const TerrasseSpecifique = ({ onDataChange, onNext, onBack, initialData }: TerrasseSpecifiqueProps) => {
  const [surface, setSurface] = useState<string>(initialData?.surface || '');
  const [typeSol, setTypeSol] = useState<string>(initialData?.typeSol || '');
  const [degreEncrassement, setDegreEncrassement] = useState<string>(initialData?.degreEncrassement || '');
  const [accessibilite, setAccessibilite] = useState<string>(initialData?.accessibilite || '');

  const updateData = () => {
    onDataChange({
      type: 'terrasse',
      surface,
      typeSol,
      degreEncrassement,
      accessibilite
    });
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurface(e.target.value);
    setTimeout(updateData, 0);
  };

  const handleTypeSolChange = (value: string) => {
    setTypeSol(value);
    setTimeout(updateData, 0);
  };

  const handleDegreEncrassementChange = (value: string) => {
    setDegreEncrassement(value);
    setTimeout(updateData, 0);
  };

  const handleAccessibiliteChange = (value: string) => {
    setAccessibilite(value);
    setTimeout(updateData, 0);
  };

  const isFormValid = surface && typeSol && degreEncrassement && accessibilite;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage de terrasse
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de terrasse avec matériel haute pression
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
              <li>• Nous vous contactons pour discuter de vos besoins</li>
              <li>• Notre équipe se rend sur place pour un nettoyage complet</li>
              <li>• Intervention avec matériel haute pression professionnel</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Nettoyage haute pression avec matériel professionnel</li>
              <li>✔️ Dégraissage et élimination des mousses</li>
              <li>✔️ Techniques adaptées aux surfaces fragiles</li>
              <li>✔️ Rinçage complet et remise en état</li>
              <li>✔️ Option traitement protecteur sur demande</li>
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
                Surface approximative (m²) *
              </label>
              <Input
                type="number"
                placeholder="Ex: 50"
                value={surface}
                onChange={handleSurfaceChange}
                min="1"
                className="cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de sol *
              </label>
              <Select value={typeSol} onValueChange={handleTypeSolChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type de sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bois" className="cursor-pointer">Bois</SelectItem>
                  <SelectItem value="pierre" className="cursor-pointer">Pierre</SelectItem>
                  <SelectItem value="beton" className="cursor-pointer">Béton</SelectItem>
                  <SelectItem value="carrelage" className="cursor-pointer">Carrelage</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Vos avantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>🌿 Terrasse propre, sûre et esthétiquement rafraîchie</li>
            <li>🧽 Préservation des matériaux et allongement de leur durée de vie</li>
            <li>🏡 Espace extérieur prêt à accueillir vos invités</li>
            <li>💧 Méthodes efficaces et respectueuses de l'environnement</li>
            <li>💰 Devis gratuit et transparent</li>
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

export default TerrasseSpecifique;