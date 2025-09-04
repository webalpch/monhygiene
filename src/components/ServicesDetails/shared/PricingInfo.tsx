import { useLanguage } from '@/contexts/LanguageContext';

export const PricingInfo = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <p className="text-blue-800 font-medium">
        {t('pricing.free_radius')}
      </p>
    </div>
  );
};

export const DetailedPricingInfo = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <span className="font-semibold">🚗 {t('pricing.travel_costs')}</span>
      <ul className="list-disc list-inside ml-4 text-gray-700">
        <li>{t('pricing.free_radius_detailed')}</li>
        <li>{t('pricing.beyond_detailed')}</li>
      </ul>
      <span className="text-sm text-muted-foreground block mt-1">
        {t('pricing.example')}
      </span>
    </div>
  );
};