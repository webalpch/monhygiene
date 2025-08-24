import React from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingInfo } from './shared/PricingInfo';

const BillardDetails = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-primary">Nettoyage du tapis de table de billard</h2>
      <div className="mt-6 mb-8">
        <div className="space-y-3">
          <div>
            <span className="font-semibold">✅ Comment ça marche ?</span>
            <ol className="list-decimal list-inside ml-4 text-gray-700">
              <li>Réservez en ligne en quelques clics.</li>
              <li>Nous vous contactons par téléphone ou WhatsApp pour confirmer les derniers détails.</li>
              <li>
                Le jour de l'intervention, notre équipe se rend chez vous pour un nettoyage soigneux du tapis de votre table de billard.
              </li>
            </ol>
          </div>
          <PricingInfo />
          <div>
            <span className="font-semibold">💰 {t('pricing.unique_rate')}</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>Nettoyage du tapis : 130 CHF</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">🧼 Ce qui est inclus</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>✔️ Aspiration en douceur et en profondeur du tapis (feutrine)</li>
              <li>✔️ Élimination des poussières fines, craies et résidus</li>
              <li>✔️ Traitement anti-taches sans agresser le tissu</li>
              <li>✔️ Utilisation de produits adaptés aux surfaces délicates</li>
              <li>✔️ Finition soignée pour préserver la qualité de jeu</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">🎯 Vos avantages</span>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              <li>🎱 Tapis propre, lisse et prêt pour le jeu</li>
              <li>🛡️ Prolongation de la durée de vie de la feutrine</li>
              <li>💨 Élimination des particules allergènes et poussières</li>
              <li>🚫 Pas besoin de démontage – intervention rapide et efficace à domicile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillardDetails;