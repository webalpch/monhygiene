import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VitresDetailsProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const VitresDetails = ({ onDataChange, onNext, onBack, initialData }: VitresDetailsProps) => {
  const [typeIntervention, setTypeIntervention] = useState<string>(initialData?.typeIntervention || '');
  const [surface, setSurface] = useState<string>(initialData?.surface || '');
  const [frequence, setFrequence] = useState<string>(initialData?.frequence || '');
  const [typeVitrage, setTypeVitrage] = useState<string>(initialData?.typeVitrage || '');

  const updateData = (updates: any) => {
    const newData = {
      type: 'vitres',
      typeIntervention,
      surface,
      frequence,
      typeVitrage,
      ...updates
    };
    onDataChange(newData);
  };

  const handleTypeInterventionChange = (value: string) => {
    setTypeIntervention(value);
    updateData({ typeIntervention: value });
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurface(e.target.value);
    updateData({ surface: e.target.value });
  };

  const handleFrequenceChange = (value: string) => {
    setFrequence(value);
    updateData({ frequence: value });
  };

  const handleTypeVitrageChange = (value: string) => {
    setTypeVitrage(value);
    updateData({ typeVitrage: value });
  };

  const isFormValid = typeIntervention && surface && frequence && typeVitrage;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nettoyage de vitres
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage de vitres pour particuliers et entreprises
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
              <li>• Nous vous contactons pour évaluer vos besoins</li>
              <li>• Notre équipe se rend sur place avec le matériel professionnel</li>
              <li>• Nettoyage complet intérieur et extérieur</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Nettoyage intérieur et extérieur</li>
              <li>✔️ Cadres, rebords et joints nettoyés</li>
              <li>✔️ Produits professionnels adaptés</li>
              <li>✔️ Finition sans traces</li>
              <li>✔️ Équipements sécurisés pour accès difficiles</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📋 Demande de devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'intervention *
              </label>
              <Select value={typeIntervention} onValueChange={handleTypeInterventionChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type d'intervention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particulier" className="cursor-pointer">Particulier</SelectItem>
                  <SelectItem value="entreprise" className="cursor-pointer">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface estimée à nettoyer (m²) *
              </label>
              <Input
                type="number"
                placeholder="Ex: 50"
                value={surface}
                onChange={handleSurfaceChange}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence souhaitée *
              </label>
              <Select value={frequence} onValueChange={handleFrequenceChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez la fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ponctuelle" className="cursor-pointer">Ponctuelle</SelectItem>
                  <SelectItem value="recurrente" className="cursor-pointer">Récurrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de vitrages *
              </label>
              <Select value={typeVitrage} onValueChange={handleTypeVitrageChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type de vitrage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples" className="cursor-pointer">Simples</SelectItem>
                  <SelectItem value="doubles" className="cursor-pointer">Doubles</SelectItem>
                  <SelectItem value="acces-difficile" className="cursor-pointer">Accès difficile</SelectItem>
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
            <li>✨ Vitres impeccables et clarté maximale</li>
            <li>🧽 Entretien qui prolonge la durée de vie</li>
            <li>🏢 Image soignée pour les entreprises</li>
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

export default VitresDetails;