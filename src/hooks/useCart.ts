import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types/reservation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface CartItem {
  id: string;
  service: Service;
  formData?: Record<string, any>;
  estimatedPrice: number;
  timestamp: number;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  totalPrice: number;
  address?: any;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    // Initialize from localStorage immediately
    const savedCart = localStorage.getItem('reservationCart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log('Initial cart from localStorage:', parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    return {
      id: '',
      sessionId: generateSessionId(),
      items: [],
      totalPrice: 0
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Save to localStorage immediately on every cart change
  useEffect(() => {
    console.log('Cart changed, saving to localStorage:', cart);
    if (cart.items.length > 0 || cart.address || cart.contactInfo) {
      localStorage.setItem('reservationCart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('reservationCart');
    }
  }, [cart.items.length, cart.totalPrice, cart.address, cart.contactInfo]);

  const calculateTotalPrice = (items: CartItem[]) => {
    const servicesOnQuote = ['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'];
    return items
      .filter(item => !servicesOnQuote.includes(item.service.id))
      .reduce((total, item) => total + item.estimatedPrice, 0);
  };

  const addToCart = async (service: Service, formData?: Record<string, any>, estimatedPrice: number = 100) => {
    console.log('Adding to cart:', service.name, estimatedPrice);
    
    const newItem: CartItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      service,
      formData,
      estimatedPrice,
      timestamp: Date.now()
    };

    // Force immediate update with functional state update
    setCart(prevCart => {
      const newItems = [...prevCart.items, newItem];
      const newTotalPrice = calculateTotalPrice(newItems);
      const updatedCart = {
        ...prevCart,
        items: newItems,
        totalPrice: newTotalPrice
      };
      console.log('Cart updated immediately:', { 
        itemCount: updatedCart.items.length, 
        totalPrice: updatedCart.totalPrice,
        cartId: updatedCart.sessionId
      });
      
      // Force immediate localStorage save
      localStorage.setItem('reservationCart', JSON.stringify(updatedCart));
      
      return updatedCart;
    });

    toast({
      title: "Service ajouté",
      description: `${service.name} a été ajouté à votre panier`,
    });

    return newItem.id;
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: newItems,
        totalPrice: calculateTotalPrice(newItems)
      };
    });

    toast({
      title: "Service retiré",
      description: "Le service a été retiré de votre panier",
    });
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCart(prev => {
      const newItems = prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      return {
        ...prev,
        items: newItems,
        totalPrice: calculateTotalPrice(newItems)
      };
    });
  };

  const updateAddress = (address: any) => {
    setCart(prev => ({
      ...prev,
      address
    }));
  };

  const updateContactInfo = (contactInfo: { name: string; email: string; phone: string }) => {
    setCart(prev => ({
      ...prev,
      contactInfo
    }));
  };

  const saveCartToDatabase = async () => {
    if (cart.items.length === 0) return { success: false, error: 'Panier vide' };

    setIsLoading(true);
    try {
      // Save cart to database
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .insert({
          session_id: cart.sessionId,
          client_name: cart.contactInfo?.name || '',
          client_email: cart.contactInfo?.email || '',
          client_phone: cart.contactInfo?.phone || '',
          address: cart.address?.address || cart.address?.place_name || '',
          city: cart.address?.city || '',
          postcode: cart.address?.postcode || '',
          coordinates: cart.address?.center ? `{${cart.address.center[0]},${cart.address.center[1]}}` : null
        })
        .select()
        .single();

      if (cartError) throw cartError;

      // Save cart items
      const cartItems = cart.items.map(item => ({
        cart_id: cartData.id,
        service_id: item.service.id,
        service_name: item.service.name,
        service_icon: item.service.icon,
        form_data: item.formData,
        estimated_price: item.estimatedPrice
      }));

      const { error: itemsError } = await supabase
        .from('cart_items')
        .insert(cartItems);

      if (itemsError) throw itemsError;

      return { success: true, cartId: cartData.id };
    } catch (error) {
      console.error('Error saving cart:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    } finally {
      setIsLoading(false);
    }
  };

  const createReservationFromCart = async (scheduleData: { date: Date; period: 'morning' | 'afternoon' }) => {
    if (cart.items.length === 0) {
      return { success: false, error: 'Panier vide' };
    }

    if (!cart.address) {
      return { success: false, error: 'Adresse manquante' };
    }

    if (!cart.contactInfo) {
      return { success: false, error: 'Informations de contact manquantes' };
    }

    setIsLoading(true);
    try {
      // Vérifier si le créneau est encore disponible
      const scheduledDate = format(scheduleData.date, 'yyyy-MM-dd');
      const scheduledTime = scheduleData.period === 'morning' ? '09:00' : '14:00';
      
      const { data: existingReservations, error: checkError } = await supabase
        .from('reservations')
        .select('id')
        .eq('scheduled_date', scheduledDate)
        .eq('scheduled_time', scheduledTime)
        .neq('status', 'cancelled');

      if (checkError) throw checkError;

      if (existingReservations && existingReservations.length > 0) {
        toast({
          title: "Créneau indisponible",
          description: "Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre.",
          variant: "destructive"
        });
        return { success: false, error: 'Créneau déjà réservé' };
      }

      // First save cart to get cart ID
      const cartResult = await saveCartToDatabase();
      if (!cartResult.success) {
        return cartResult;
      }

      // Create reservation directly in the reservations table
      const totalPrice = cart.items.reduce((sum, item) => sum + item.estimatedPrice, 0);
      const serviceTypes = cart.items.map(item => item.service.name).join(', ');
      
      console.log('Creating reservation with cart data:', {
        items: cart.items,
        contactInfo: cart.contactInfo,
        address: cart.address,
        scheduleData
      });
      
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          client_name: cart.contactInfo.name,
          client_email: cart.contactInfo.email,
          client_phone: cart.contactInfo.phone,
          address: cart.address.address || cart.address.place_name,
          city: cart.address.city || '',
          postcode: cart.address.postcode || '',
          coordinates: cart.address.center ? `{${cart.address.center[0]},${cart.address.center[1]}}` : null,
          service_type: serviceTypes,
          service_details: {
            services: cart.items.map(item => ({
              id: item.service.id,
              name: item.service.name,
              formData: item.formData,
              estimatedPrice: item.estimatedPrice
            })),
            // Flatten the formData from the first service to root level for backward compatibility
            ...(cart.items[0]?.formData || {})
          },
          scheduled_date: format(scheduleData.date, 'yyyy-MM-dd'),
          scheduled_time: scheduleData.period === 'morning' ? '09:00' : '14:00',
          duration_minutes: 120,
          estimated_price: totalPrice,
          status: 'pending',
          payment_status: 'pending',
          notes: '',
          internal_notes: `Réservation créée via panier le ${new Date().toLocaleString('fr-CH')}`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Réservation créée",
        description: "Votre réservation multi-services a été confirmée",
      });

      return { success: true, reservationId: data.id };
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive"
      });
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    // Réinitialiser complètement le panier avec toutes les informations
    setCart({
      id: '',
      sessionId: generateSessionId(),
      items: [],
      totalPrice: 0,
      address: undefined,
      contactInfo: undefined
    });
    // Supprimer toutes les données du localStorage
    localStorage.removeItem('reservationCart');
    console.log('🗑️ Panier complètement vidé - toutes les informations supprimées');
  };

  const refreshCart = () => {
    const savedCart = localStorage.getItem('reservationCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Forcing cart refresh from localStorage:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to refresh cart from localStorage:', error);
      }
    }
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    updateAddress,
    updateContactInfo,
    createReservationFromCart,
    clearCart,
    refreshCart,
    saveCartToDatabase
  };
};