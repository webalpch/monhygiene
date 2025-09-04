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
          {t('services_details.mattress_cleaning')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('services.mattress_desc')}
        </p>
      </div>

      <PricingInfo />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ {t('services_details.how_it_works')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• {t('services_details.book_online')}</li>
              <li>• {t('services_details.we_contact')}</li>
              <li>• {t('services_details.team_intervention')}</li>
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
          <CardTitle>💰 {t('services_details.pricing')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('services_details.select_size')} *
              </label>
              <Select value={taille} onValueChange={handleTailleChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder={t('services_details.select_size')} />
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
                  {t('services_details.total_price')}: {tarifs[taille as keyof typeof tarifs]} CHF
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 {t('services_details.your_benefits')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✨ {t('services_details.mattress_benefits.like_new')}</li>
            <li>🛡️ {t('services_details.mattress_benefits.extends_life')}</li>
            <li>😴 {t('services_details.mattress_benefits.healthy_sleep')}</li>
            <li>🏠 {t('services_details.mattress_benefits.home_service')}</li>
            <li>💚 {t('services_details.mattress_benefits.eco_products')}</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 text-lg rounded-2xl"
        >
          {t('services_details.back')}
        </Button>
        
        {taille && (
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-2xl"
          >
            {t('services_details.continue')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatelasDetails;