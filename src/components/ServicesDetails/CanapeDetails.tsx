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
          {t('services_details.sofa_cleaning')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('services.sofa_desc')}
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
            <CardTitle>🧼 {t('services_details.what_included')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ {t('services_details.pre_treatment')}</li>
              <li>✔️ {t('services_details.deep_cleaning')}</li>
              <li>✔️ {t('services_details.thorough_vacuum')}</li>
              <li>✔️ {t('services_details.fabric_products')}</li>
              <li>✔️ {t('services_details.fast_drying')}</li>
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
                {t('services_details.select_places')} *
              </label>
              <Select value={places} onValueChange={handlePlacesChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder={t('services_details.select_places')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tarifs).map(([place, tarif]) => (
                    <SelectItem key={place} value={place} className="cursor-pointer">
                      {place} {place === '1' ? t('services_details.place_singular') : t('services_details.place_plural')} - {tarif} CHF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {places && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-800">
                  {t('services_details.total_price')}: {tarifs[places as keyof typeof tarifs]} CHF
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
            <li>🛋️ {t('services_details.sofa_benefits.like_new')}</li>
            <li>🏠 {t('services_details.sofa_benefits.home_service')}</li>
            <li>🧽 {t('services_details.sofa_benefits.professional_products')}</li>
            <li>⚡ {t('services_details.sofa_benefits.fast_drying')}</li>
            <li>🛡️ {t('services_details.sofa_benefits.extends_life')}</li>
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
        
        {places && (
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

export default CanapeDetails;