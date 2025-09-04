import React from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingInfo } from './shared/PricingInfo';

const BillardDetails = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-primary">{t('services_details.billiard_cleaning')}</h2>
      <div className="mt-6 mb-8">
        <div className="space-y-3">
          <div>
            <span className="font-semibold">✅ {t('services_details.how_it_works')}</span>
            <ol className="list-decimal list-inside ml-4 text-gray-700">
              <li>{t('services_details.book_online')}</li>
              <li>{t('services_details.we_contact')}</li>
              <li>{t('services_details.team_intervention')}</li>
            </ol>
          </div>
          <PricingInfo />
          <div>
            <span className="font-semibold">💰 {t('pricing.unique_rate')}</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>{t('services_details.billiard_cleaning')}: 130 CHF</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">🧼 {t('services_details.what_included')}</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>{t('services_details.gentle_vacuuming')}</li>
              <li>{t('services_details.dust_removal')}</li>
              <li>{t('services_details.stain_treatment')}</li>
              <li>{t('services_details.delicate_products')}</li>
              <li>{t('services_details.quality_finish')}</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">🎯 {t('services_details.your_benefits')}</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>{t('services_details.billiard_benefits.clean_carpet')}</li>
              <li>{t('services_details.billiard_benefits.extends_life')}</li>
              <li>{t('services_details.billiard_benefits.allergen_removal')}</li>
              <li>{t('services_details.billiard_benefits.no_disassembly')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillardDetails;