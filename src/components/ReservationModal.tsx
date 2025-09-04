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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

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
          title: t('incompleteStep'),
          description: t('completeRequiredInfo'),
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

  const handleSubmit = async (contactData?: { name: string; email: string; phone: string }) => {
    console.log('🎯 ReservationModal handleSubmit called with:', {
      cart: cart.items.length,
      selectedSlot,
      contactData,
      currentContactInfo: cart.contactInfo
    });
    
    if (!selectedSlot) {
      toast({
        title: t('missingSlot'),
        description: t('selectTimeSlot'),
        variant: "destructive"
      });
      return;
    }

    try {
      // S'assurer que les informations de contact sont à jour avant la soumission
      if (contactData) {
        console.log('🔄 Updating contact info with:', contactData);
        updateContactInfo(contactData);
        
        // Attendre un peu pour que l'état se mette à jour
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('📤 Creating reservation from cart...');
      const result = await createReservationFromCart(selectedSlot);
      
      if (result.success) {
        console.log('✅ Reservation created successfully');
        
        // Envoyer la notification Netlify après confirmation de la réservation
        if (selectedSlot && contactData) {
          console.log('📧 Sending success Netlify notification...');
          try {
            const netlifyFormData = new FormData();
            netlifyFormData.append('form-name', 'notification');
            netlifyFormData.append('message', `✅ RÉSERVATION CONFIRMÉE - ${contactData.name} - ${formatDate(selectedSlot.date)} - ${selectedSlot.period === 'morning' ? '09h00-12h00' : '14h00-17h00'} - ${cart.items.length} service(s)`);
            
            const response = await fetch('/', {
              method: 'POST',
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams(netlifyFormData as any).toString()
            });
            console.log('📧 Success notification sent:', response.status);
          } catch (error) {
            console.log('❌ Erreur envoi notification succès:', error);
          }
        }
        
        if ('reservationId' in result && result.reservationId) {
          setCreatedReservationId(result.reservationId);
        }
        setShowSuccess(true);
      } else {
        console.log('❌ Reservation creation failed:', result.error);
        toast({
          title: t('error'),
          description: result.error || t('unexpectedError'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Submission error:', error);
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-CH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
        <DialogContent className="w-[95vw] max-w-3xl mx-auto p-0 overflow-hidden rounded-2xl max-h-[85vh] sm:max-h-[80vh] sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col max-h-[85vh] sm:max-h-[80vh]">
            <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-white/80 backdrop-blur-sm">
              {/* Step Title */}
              <div className="text-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {currentStep === 'services' && t('stepSelection')}
                  {currentStep === 'address' && t('stepAddress')}
                  {currentStep === 'schedule' && t('stepSchedule')}
                  {currentStep === 'contact' && t('stepContact')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('stepOf').replace('{0}', String(steps.indexOf(currentStep) + 1)).replace('{1}', String(steps.length))}
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
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
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
