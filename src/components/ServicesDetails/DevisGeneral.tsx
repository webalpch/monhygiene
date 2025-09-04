import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DevisGeneralProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
  serviceTitle: string;
  serviceDescription: string;
}

const DevisGeneral = ({ onDataChange, onNext, onBack, initialData, serviceTitle, serviceDescription }: DevisGeneralProps) => {
  const [typeLocal, setTypeLocal] = useState<string>(initialData?.typeLocal || '');
  const [surface, setSurface] = useState<string>(initialData?.surface || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [frequence, setFrequence] = useState<string>(initialData?.frequence || '');

  const updateData = () => {
    onDataChange({
      type: 'devis',
      typeLocal,
      surface,
      description,
      frequence
    });
  };

  const handleTypeLocalChange = (value: string) => {
    setTypeLocal(value);
    setTimeout(updateData, 0);
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurface(e.target.value);
    setTimeout(updateData, 0);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setTimeout(updateData, 0);
  };

  const handleFrequenceChange = (value: string) => {
    setFrequence(value);
    setTimeout(updateData, 0);
  };

  const isFormValid = typeLocal && surface && description && frequence;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {serviceTitle}
        </h1>
        <p className="text-lg text-gray-600">
          {serviceDescription}
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
              <li>• Intervention complète selon vos exigences</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Matériel professionnel de pointe</li>
              <li>✔️ Produits écologiques et efficaces</li>
              <li>✔️ Intervention complète et soignée</li>
              <li>✔️ Nettoyage en profondeur</li>
              <li>✔️ Finition impeccable</li>
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
                Type de local *
              </label>
              <Select value={typeLocal} onValueChange={handleTypeLocalChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Sélectionnez le type de local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appartement" className="cursor-pointer">Appartement</SelectItem>
                  <SelectItem value="maison" className="cursor-pointer">Maison</SelectItem>
                  <SelectItem value="bureau" className="cursor-pointer">Bureau</SelectItem>
                  <SelectItem value="commerce" className="cursor-pointer">Commerce</SelectItem>
                  <SelectItem value="autre" className="cursor-pointer">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface approximative (m²) *
              </label>
              <Input
                type="number"
                placeholder="Ex: 100"
                value={surface}
                onChange={handleSurfaceChange}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <Textarea
                placeholder="Décrivez vos besoins spécifiques, l'état actuel, les zones à traiter..."
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
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
                  <SelectItem value="unique" className="cursor-pointer">Unique</SelectItem>
                  <SelectItem value="mensuel" className="cursor-pointer">Mensuel</SelectItem>
                  <SelectItem value="trimestriel" className="cursor-pointer">Trimestriel</SelectItem>
                  <SelectItem value="semestriel" className="cursor-pointer">Semestriel</SelectItem>
                  <SelectItem value="annuel" className="cursor-pointer">Annuel</SelectItem>
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
            <li>✨ Intervention sur mesure adaptée à vos besoins</li>
            <li>💰 Devis gratuit et transparent</li>
            <li>🏠 Service à domicile ou sur site</li>
            <li>💚 Produits respectueux de l'environnement</li>
            <li>🔧 Matériel professionnel de pointe</li>
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

export default DevisGeneral;