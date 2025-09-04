
import React from "react";

const ToitureDetails = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-primary">
      Nettoyage de toiture pour particuliers &amp; professionnels
    </h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <div>
        <span className="font-semibold text-primary">✅ Comment ça marche ?</span>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Faites une demande de devis en ligne en quelques clics.</li>
          <li>Nous vous contactons par téléphone ou WhatsApp pour discuter de vos besoins et fixer un rendez-vous.</li>
          <li>Le jour de l’intervention, notre équipe se rend sur place pour un nettoyage complet de votre toiture.</li>
        </ul>
      </div>

      <div>
        <span className="font-semibold text-primary">🚗 Frais de déplacement</span>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Gratuit dans un rayon de 5 km autour de notre siège à Sion (Valais).</li>
          <li>Au-delà de 5 km : CHF 0.75/km (aller simple).</li>
          <li className="ml-4 text-sm text-muted-foreground">Exemple : Sion → Martigny = CHF 20.25 à ajouter au tarif.</li>
        </ul>
      </div>

      <div>
        <span className="font-semibold text-primary">📋 Tarifs de nettoyage</span>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Tarification uniquement sur devis, selon&nbsp;:</li>
          <ul className="list-[circle] list-inside ml-5">
            <li>La surface à nettoyer</li>
            <li>Le type de toiture (tuiles, ardoises, bac acier, etc.)</li>
            <li>Le niveau d’encrassement (mousses, lichens, débris)</li>
            <li>L’accessibilité du toit</li>
            <li>Le type de client&nbsp;: particulier ou entreprise</li>
          </ul>
        </ul>
      </div>

      <div>
        <span className="font-semibold text-primary">🧼 Ce qui est inclus</span>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>✔️ Nettoyage en profondeur avec matériel professionnel adapté (haute pression, brosses spécifiques)</li>
          <li>✔️ Élimination des mousses, lichens, saletés et débris</li>
          <li>✔️ Traitement respectueux des matériaux fragiles et prévention des dégâts</li>
          <li>✔️ Rinçage complet et remise en état immédiate</li>
          <li>✔️ Option de traitement protecteur hydrofuge ou anti-mousse (sur demande)</li>
        </ul>
      </div>

      <div>
        <span className="font-semibold text-primary">🎯 Vos avantages</span>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>🌿 Toiture propre, protégée et visuellement rénovée</li>
          <li>🧽 Préservation et prolongation de la durée de vie de votre toiture</li>
          <li>🏡 Sécurisation de votre habitation contre les infiltrations et dégradations</li>
          <li>💧 Méthodes efficaces et respectueuses de l’environnement</li>
        </ul>
      </div>
    </div>
  </div>
);

export default ToitureDetails;

