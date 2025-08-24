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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sélectionnez vos services</h2>
        <p className="text-gray-600">Ajoutez tous les services dont vous avez besoin</p>
      </div>

      {/* Layout: Services Grid + Cart Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services Grid */}
        <div className="lg:col-span-2 space-y-6">
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
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Retour à l'adresse
        </button>
        
        {/* Mobile Continue Button (hidden on desktop) */}
        {canContinue && (
          <button
            onClick={onNext}
            className="lg:hidden px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuer →
          </button>
        )}
      </div>
    </div>
  );
};