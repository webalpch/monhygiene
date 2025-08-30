import React from 'react';
import { CartServiceGrid } from '../CartServiceGrid';
import { CartSummary } from '../CartSummary';
import { Service } from '@/types/reservation';
import { CartItem } from '@/hooks/useCart';

interface CartServicesStepProps {
  cartItems: CartItem[];
  totalPrice: number;
  onAddToCart: (service: Service, formData?: Record<string, any>, price?: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CartServicesStep: React.FC<CartServicesStepProps> = ({
  cartItems,
  totalPrice,
  onAddToCart,
  onRemoveFromCart,
  onNext,
  onBack
}) => {
  const canContinue = cartItems.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sélectionnez vos services</h2>
        <p className="text-sm sm:text-base text-gray-600">Ajoutez tous les services dont vous avez besoin</p>
      </div>

      {/* Layout: Services Grid + Cart Summary */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Services Grid */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <CartServiceGrid onAddToCart={onAddToCart} />
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:col-span-1">
          <CartSummary
            items={cartItems}
            totalPrice={totalPrice}
            onRemoveItem={onRemoveFromCart}
            onContinue={onNext}
            showContinueButton={canContinue}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors rounded-lg border border-gray-300 hover:border-gray-400 font-medium order-2 sm:order-1"
        >
          ← Retour à l'adresse
        </button>
        
        {/* Mobile Continue Button (hidden on desktop) */}
        {canContinue && (
          <button
            onClick={onNext}
            className="lg:hidden w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium order-1 sm:order-2"
          >
            Continuer →
          </button>
        )}
      </div>
    </div>
  );
};