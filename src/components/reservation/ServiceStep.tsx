
import { Button } from '@/components/ui/button';
import { SERVICES } from '@/data/services';
import { icons } from 'lucide-react';

interface ServiceStepProps {
  selectedServiceId: string;
  onServiceSelect: (serviceId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ServiceStep = ({ selectedServiceId, onServiceSelect, onNext, onBack }: ServiceStepProps) => {
  const selectedService = SERVICES.find(s => s.id === selectedServiceId);

  const handleServiceSelect = (serviceId: string) => {
    onServiceSelect(serviceId);
    // Scroll vers le bouton suivant à l'intérieur de la modal
    setTimeout(() => {
      const modalContent = document.querySelector('[data-radix-dialog-content]');
      if (modalContent) {
        const buttonContainer = modalContent.querySelector('.flex.justify-between');
        if (buttonContainer) {
          buttonContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          });
        }
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quel service souhaitez-vous ?
        </h1>
        <p className="text-lg text-gray-600">
          Sélectionnez le type d'intervention dont vous avez besoin
        </p>
      </div>

      {/* Grille des services pour tous les écrans */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {SERVICES.map((service) => {
          const IconComponent = icons[service.icon as keyof typeof icons];
          const isSelected = selectedServiceId === service.id;

          return (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  {IconComponent && (
                    <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  )}
                </div>
                
                <h3 className={`text-sm md:text-base font-semibold mb-2 md:mb-3 text-center ${
                  isSelected ? 'text-primary' : 'text-gray-900'
                }`}>
                  {service.name}
                </h3>
                
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 text-center flex-grow line-clamp-2 md:line-clamp-3">
                  {service.description}
                </p>
                
                {isSelected && (
                  <div className="text-primary text-xs md:text-sm font-medium animate-fade-in">
                    ✓ Sélectionné
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="font-medium text-blue-900">Service sélectionné :</div>
          <div className="text-blue-700">{selectedService.name}</div>
        </div>
      )}

      <div className="flex justify-between pt-2 mb-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 text-lg rounded-2xl"
        >
          Retour
        </Button>
        
        {selectedServiceId && (
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-2xl"
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};
