import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartSummaryProps {
  items: CartItem[];
  totalPrice: number;
  onRemoveItem: (itemId: string) => void;
  onContinue: () => void;
  showContinueButton: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  totalPrice,
  onRemoveItem,
  onContinue,
  showContinueButton
}) => {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">{t('cartEmpty')}</p>
          <p className="text-sm text-gray-400">{t('cartEmptySubtext')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{t('cartTitle')} ({items.length})</span>
          <Badge variant="secondary">{totalPrice} CHF</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{t(`services.${item.service.id}.name`) || item.service.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'].includes(item.service.id)
                    ? t('onQuote')
                    : `${item.estimatedPrice} CHF`}
                </p>
                
                {/* Show form data summary if available */}
                {item.formData && Object.keys(item.formData).length > 0 && (
                  <div className="mt-1">
                    {item.formData.numberOfSeats && (
                      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded mr-1">
                        {item.formData.numberOfSeats} {t('seats')}
                      </span>
                    )}
                    {item.formData.vehicleType && (
                      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded mr-1">
                        {item.formData.vehicleType}
                      </span>
                    )}
                    {item.formData.matressSize && (
                      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded mr-1">
                        {item.formData.matressSize}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center font-semibold">
            <span>{t('totalPrice')}</span>
            <span className="text-primary text-lg">{totalPrice} CHF</span>
          </div>
        </div>

        {/* Continue Button */}
        {showContinueButton && (
          <Button onClick={onContinue} className="w-full" size="lg">
            {t('continue')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};