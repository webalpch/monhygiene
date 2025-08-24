import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BillardSimpleProps {
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

const BillardSimple = ({ onDataChange, onNext, onBack, initialData }: BillardSimpleProps) => {
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
          Nettoyage tapis de billard
        </h1>
        <p className="text-lg text-gray-600">
          Service professionnel de nettoyage du tapis de votre table de billard
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
              <li>• Réservez en ligne en quelques clics</li>
              <li>• Nous vous contactons pour confirmer les détails</li>
              <li>• Notre équipe se rend chez vous avec le matériel spécialisé</li>
              <li>• Nettoyage soigneux du tapis de billard</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧼 Ce qui est inclus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✔️ Aspiration en douceur et en profondeur</li>
              <li>✔️ Élimination des poussières et craies</li>
              <li>✔️ Traitement anti-taches délicat</li>
              <li>✔️ Produits adaptés aux surfaces délicates</li>
              <li>✔️ Finition soignée pour préserver la qualité de jeu</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💰 Tarif fixe : 130 CHF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-medium text-green-800">
              Prix total: {tarifFixe} CHF
            </p>
            <p className="text-sm text-green-600 mt-1">
              Tarif fixe pour toutes les tables de billard
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Vos avantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>🎱 Tapis propre, lisse et prêt pour le jeu</li>
            <li>🛡️ Prolongation de la durée de vie de la feutrine</li>
            <li>💨 Élimination des particules et poussières</li>
            <li>🏠 Pas besoin de démontage - intervention rapide à domicile</li>
            <li>🔧 Matériel professionnel adapté</li>
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
        
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-2xl"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default BillardSimple;