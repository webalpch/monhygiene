import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingInfo } from './shared/PricingInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BillardSimpleProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const BillardSimple = ({ onDataChange, onNext, onBack, initialData }: BillardSimpleProps) => {
  const { t } = useLanguage();
  const tarifFixe = 130;

  useState(() => {
    onDataChange({
      type: 'billard',
      price: tarifFixe
    });
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('services_details.billiard_cleaning')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('services.billiard_desc')}
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
              <li>{t('services_details.gentle_vacuuming')}</li>
              <li>{t('services_details.dust_removal')}</li>
              <li>{t('services_details.stain_treatment')}</li>
              <li>{t('services_details.delicate_products')}</li>
              <li>{t('services_details.quality_finish')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💰 {t('pricing.unique_rate')}: {tarifFixe} CHF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-medium text-green-800">
              {t('services_details.total_price')}: {tarifFixe} CHF
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 {t('services_details.your_benefits')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>{t('services_details.billiard_benefits.clean_carpet')}</li>
            <li>{t('services_details.billiard_benefits.extends_life')}</li>
            <li>{t('services_details.billiard_benefits.allergen_removal')}</li>
            <li>{t('services_details.billiard_benefits.no_disassembly')}</li>
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
        
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-2xl"
        >
          {t('services_details.continue')}
        </Button>
      </div>
    </div>
  );
};

export default BillardSimple;