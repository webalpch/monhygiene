import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCart } from '@/hooks/useCart';
import { CartAddressStep } from '@/components/cart/steps/CartAddressStep';
import { CartServicesStep } from '@/components/cart/steps/CartServicesStep';
import { CartScheduleStep } from '@/components/cart/steps/CartScheduleStep';
import { CartContactStep } from '@/components/cart/steps/CartContactStep';
import { SuccessModal } from '@/components/reservation/SuccessModal';
import { CartStep } from '@/types/cart';
import { Service } from '@/types/reservation';
import { toast } from '@/hooks/use-toast';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateAddress,
    updateContactInfo,
    createReservationFromCart,
    clearCart
  } = useCart();

  const [currentStep, setCurrentStep] = useState<CartStep>('services');
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; period: 'morning' | 'afternoon' } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<string | null>(null);

  const steps: CartStep[] = ['services', 'address', 'schedule', 'contact'];

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (canProceedToStep(nextStep)) {
        setCurrentStep(nextStep);
        // Scroll vers le haut du modal à chaque changement d'étape
        setTimeout(() => {
          const modalContent = document.querySelector('[role="dialog"] .overflow-y-auto');
          if (modalContent) {
            modalContent.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        toast({
          title: "Étape incomplète",
          description: "Veuillez compléter les informations requises avant de continuer.",
          variant: "destructive"
        });
      }
    }
  };

  const canProceedToStep = (step: CartStep): boolean => {
    switch (step) {
      case 'services':
        return true;
      case 'address':
        return cart.items.length > 0;
      case 'schedule':
        return !!cart.address && cart.items.length > 0;
      case 'contact':
        return !!cart.address && cart.items.length > 0 && !!selectedSlot;
      default:
        return false;
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      // Scroll vers le haut du modal à chaque changement d'étape
      setTimeout(() => {
        const modalContent = document.querySelector('[role="dialog"] .overflow-y-auto');
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      toast({
        title: "Créneaux manquant",
        description: "Veuillez sélectionner un créneau horaire",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createReservationFromCart(selectedSlot);
      
      if (result.success) {
        if ('reservationId' in result && result.reservationId) {
          setCreatedReservationId(result.reservationId);
        }
        setShowSuccess(true);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur s'est produite",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    clearCart();
    onClose();
  };

  const handleNewReservation = () => {
    setShowSuccess(false);
    clearCart();
    setCurrentStep('services');
  };

  const handleClose = () => {
    onClose();
    // Reset to services step when closing
    setCurrentStep('services');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'services':
        return (
          <CartServicesStep
            cartItems={cart.items}
            totalPrice={cart.totalPrice}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'address':
        return (
          <CartAddressStep
            address={cart.address}
            onAddressSelect={updateAddress}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'schedule':
        return (
          <CartScheduleStep
            cartItems={cart.items}
            totalPrice={cart.totalPrice}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 'contact':
        return (
          <CartContactStep
            cartItems={cart.items}
            totalPrice={cart.totalPrice}
            address={cart.address}
            selectedSlot={selectedSlot}
            contactInfo={cart.contactInfo}
            onContactUpdate={updateContactInfo}
            onSubmit={handleSubmit}
            onBack={goToPreviousStep}
            isSubmitting={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[98vw] sm:max-w-6xl lg:max-w-7xl max-h-[95vh] sm:max-h-[90vh] p-0 overflow-hidden rounded-lg sm:rounded-2xl mx-2 sm:mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col min-h-[400px] max-h-[95vh]">
            <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-white/80 backdrop-blur-sm">
              {/* Step Title */}
              <div className="text-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {currentStep === 'services' && 'Sélection des services'}
                  {currentStep === 'address' && 'Adresse d\'intervention'}
                  {currentStep === 'schedule' && 'Planification'}
                  {currentStep === 'contact' && 'Informations de contact'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Étape {steps.indexOf(currentStep) + 1} sur {steps.length}
                </p>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-1 overflow-x-auto px-2">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      steps.indexOf(currentStep) >= index 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-4 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                        steps.indexOf(currentStep) > index 
                          ? 'bg-primary' 
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6 pb-20 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
              {renderCurrentStep()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        onNewReservation={handleNewReservation}
        reservationId={createdReservationId || undefined}
      />
    </>
  );
};
