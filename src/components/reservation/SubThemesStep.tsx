import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Import des composants de détails des services
import CanapeDetails from '@/components/ServicesDetails/CanapeDetails';
import MatelasDetails from '@/components/ServicesDetails/MatelasDetails';
import VitresDetails from '@/components/ServicesDetails/VitresDetails';
import BillardSimple from '@/components/ServicesDetails/BillardSimple';
import TerrasseSpecifique from '@/components/ServicesDetails/TerrasseSpecifique';
import ToitureSpecifique from '@/components/ServicesDetails/ToitureSpecifique';
import VehiculeDetails from '@/components/ServicesDetails/VehiculeDetails';
import ShampooinageSieges from '@/components/ServicesDetails/ShampooinageSieges';
import MoquetteTapisDetails from '@/components/ServicesDetails/MoquetteTapisDetails';
import DevisGeneral from '@/components/ServicesDetails/DevisGeneral';

interface SubThemesStepProps {
  serviceId: string;
  subThemes: Record<string, string>;
  onSubThemesUpdate: (subThemes: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SubThemesStep = ({ serviceId, subThemes, onSubThemesUpdate, onNext, onBack }: SubThemesStepProps) => {
  const [formData, setFormData] = useState<any>(subThemes);

  const handleDataChange = (data: any) => {
    setFormData(data);
    onSubThemesUpdate(data);
  };

  const renderServiceDetails = () => {
    const commonProps = {
      onDataChange: handleDataChange,
      onNext,
      onBack,
      initialData: formData
    };

    switch (serviceId) {
      case 'nettoyage-canape':
        return <CanapeDetails {...commonProps} />;
      
      case 'nettoyage-matelas':
        return <MatelasDetails {...commonProps} />;
      
      case 'nettoyage-vitres':
        return <VitresDetails {...commonProps} />;
      
      case 'shampooinage-sieges':
        return <ShampooinageSieges {...commonProps} />;
      
      case 'nettoyage-moquette-tapis':
        return <MoquetteTapisDetails {...commonProps} />;
      
      case 'nettoyage-billard':
        return <BillardSimple {...commonProps} />;
      
      case 'nettoyage-terrasse':
        return <TerrasseSpecifique {...commonProps} />;
      
      case 'nettoyage-toiture':
        return <ToitureSpecifique {...commonProps} />;
      
      case 'nettoyage-vehicule':
        return <VehiculeDetails {...commonProps} />;
      
      case 'nettoyage-bureaux':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Nettoyage de bureaux"
            serviceDescription="Entretien professionnel de vos locaux commerciaux"
          />
        );
      
      case 'nettoyage-domicile':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Nettoyage à domicile"
            serviceDescription="Service de ménage personnalisé pour votre domicile"
          />
        );
      
      case 'nettoyage-fin-chantier':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Nettoyage fin de chantier"
            serviceDescription="Remise en état complète après travaux de construction"
          />
        );
      
      case 'nettoyage-post-demenagement':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Nettoyage post-déménagement"
            serviceDescription="Nettoyage en profondeur après votre déménagement"
          />
        );
      
      case 'entretien-espaces-verts':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Entretien espaces verts"
            serviceDescription="Entretien et jardinage de vos espaces extérieurs"
          />
        );
      
      case 'desinfection':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Désinfection"
            serviceDescription="Désinfection professionnelle de vos locaux"
          />
        );
      
      case 'nettoyage-haute-pression':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Nettoyage haute pression"
            serviceDescription="Nettoyage de façades, terrasses et surfaces extérieures"
          />
        );
      
      case 'autres-services':
        return (
          <DevisGeneral
            {...commonProps}
            serviceTitle="Autres services"
            serviceDescription="Services de nettoyage personnalisés selon vos besoins"
          />
        );
      
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">
              <p className="text-gray-600">
                Sélectionnez un service pour voir les détails et options disponibles.
              </p>
            </div>
            <div className="flex justify-between pt-2 mb-8">
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
    }
  };

  return (
    <div className="w-full">
      {renderServiceDetails()}
    </div>
  );
};

export default SubThemesStep;