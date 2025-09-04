import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const CartWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const cartHook = useCart();
  const { cart, removeFromCart } = cartHook;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const itemCount = cart.items.length;
  const totalPrice = cart.totalPrice;

  // Force re-render when cart changes
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [cart.items.length, cart.totalPrice]);

  console.log('CartWidget render:', { itemCount, totalPrice, cartId: cart.id, forceRender });

  const handleGoToReservation = () => {
    setIsOpen(false);
    navigate('/fr/reservation');
  };

  const handleOpenCart = () => {
    // Force refresh cart data from localStorage when opening
    cartHook.refreshCart();
    setForceRender(prev => prev + 1);
    setIsOpen(true);
  };

  const formatCartDetails = (cartDetails: Record<string, any>) => {
    if (!cartDetails || Object.keys(cartDetails).length === 0) {
      return null;
    }

    const details = [];
    if (cartDetails.pack) details.push(`Pack: ${cartDetails.pack}`);
    if (cartDetails.numberOfSeats) details.push(`${cartDetails.numberOfSeats} place${cartDetails.numberOfSeats > 1 ? 's' : ''}`);
    if (cartDetails.matressSize) details.push(`Taille: ${cartDetails.matressSize}`);
    if (cartDetails.numberOfRooms) details.push(`${cartDetails.numberOfRooms} pièce${cartDetails.numberOfRooms > 1 ? 's' : ''}`);
    if (cartDetails.surface) details.push(`Surface: ${cartDetails.surface}m²`);
    if (cartDetails.surfaceType) details.push(`Type: ${cartDetails.surfaceType}`);

    return details.length > 0 ? details.join(', ') : null;
  };

  // Toujours afficher le widget panier
  const shouldShowWidget = true;

  return (
    <>
      {/* Widget panier fixe */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={handleOpenCart}
          className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
          key={forceRender} // Force re-render when this changes
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Modal récapitulatif */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal content */}
          <Card className="relative w-full max-w-md mx-4 max-h-[80vh] overflow-hidden animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>{t('myCart')}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4 max-h-96 overflow-y-auto" key={`cart-content-${forceRender}`}>
              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
                  <Button 
                    onClick={handleGoToReservation}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {t('cart.goodbye_dirt_btn')}
                  </Button>
                </div>
              ) : (
                <>
                  {cart.items.map((item, index) => {
                    // Services sur devis
                    const servicesOnQuote = ['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'];
                    const isOnQuote = servicesOnQuote.includes(item.service.id);
                    
                    return (
                      <div key={`${item.id}-${forceRender}`} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.service.name}</h4>
                          {formatCartDetails(item.formData) && (
                            <p className="text-xs text-gray-600 mt-1">
                              {formatCartDetails(item.formData)}
                            </p>
                          )}
                          {!isOnQuote && (
                            <p className="text-sm font-semibold text-primary mt-1">
                              {item.estimatedPrice} CHF
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>{t('total')}:</span>
                      <span className="text-primary">
                        {totalPrice > 0 ? `${totalPrice} CHF` : t('onQuote')}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoToReservation}
                    className="w-full"
                    size="lg"
                  >
                    {t('cart.goodbye_dirt_btn')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};