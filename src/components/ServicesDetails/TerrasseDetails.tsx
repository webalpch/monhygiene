
import React from "react";

const TerrasseDetails = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-primary">Nettoyage de terrasse pour particuliers & professionnels</h2>
    <div className="mt-6 mb-8">
      <div className="space-y-3">
        {/* Comment ça marche */}
        <div>
          <span className="font-semibold">✅ Comment ça marche ?</span>
          <ol className="list-decimal list-inside ml-4 text-gray-700">
            <li>Faites une demande de devis en ligne en quelques clics.</li>
            <li>Nous vous contactons par téléphone ou WhatsApp pour discuter de vos besoins et fixer un rendez-vous.</li>
            <li>Le jour de l’intervention, notre équipe se rend sur place pour un nettoyage complet de votre terrasse.</li>
          </ol>
        </div>
        {/* Frais de déplacement */}
        <div>
          <span className="font-semibold">🚗 Frais de déplacement</span>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            <li>Gratuit dans un rayon de 5 km autour de notre siège à Sion (Valais).</li>
            <li>Au-delà de 5 km : CHF 0.75/km (aller simple).</li>
          </ul>
          <span className="text-sm text-muted-foreground block mt-1">
            Exemple : Sion → Martigny = CHF 20.25 à ajouter au tarif.
          </span>
        </div>
        {/* Tarifs de nettoyage */}
        <div>
          <span className="font-semibold">📋 Tarifs de nettoyage</span>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            <li>
              Tarification uniquement sur devis, selon :
              <ul className="list-disc ml-8">
                <li>La surface à nettoyer</li>
                <li>Le type de revêtement (bois, pierre, carrelage, béton, etc.)</li>
                <li>Le niveau d’encrassement</li>
                <li>L’accessibilité du lieu</li>
                <li>Le type de client : particulier ou entreprise</li>
              </ul>
            </li>
          </ul>
        </div>
        {/* Ce qui est inclus */}
        <div>
          <span className="font-semibold">🧼 Ce qui est inclus</span>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            <li>✔️ Nettoyage en profondeur avec matériel professionnel haute pression</li>
            <li>✔️ Dégraissage et élimination des mousses, lichens et saletés</li>
            <li>✔️ Respect des surfaces fragiles grâce à des techniques adaptées</li>
            <li>✔️ Rinçage complet et remise en état immédiate</li>
            <li>✔️ Option de traitement protecteur (sur demande)</li>
          </ul>
        </div>
        {/* Vos avantages */}
        <div>
          <span className="font-semibold">🎯 Vos avantages</span>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            <li>🌿 Terrasse propre, sûre et esthétiquement rafraîchie</li>
            <li>🧽 Préservation des matériaux et allongement de leur durée de vie</li>
            <li>🏡 Espace extérieur prêt à accueillir vos invités ou clients</li>
            <li>💧 Méthodes efficaces et respectueuses de l’environnement</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default TerrasseDetails;
