import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartContactStepProps {
  cartItems: CartItem[];
  totalPrice: number;
  address: any;
  selectedSlot: { date: Date; period: 'morning' | 'afternoon' } | null;
  contactInfo: { name: string; email: string; phone: string } | undefined;
  onContactUpdate: (contact: { name: string; email: string; phone: string }) => void;
  onSubmit: (contactData?: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const CartContactStep: React.FC<CartContactStepProps> = ({
  cartItems,
  totalPrice,
  address,
  selectedSlot,
  contactInfo,
  onContactUpdate,
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: contactInfo?.name || '',
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
    notes: ''
  });
  const { t } = useLanguage();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = t('phoneMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    console.log('🚀 Starting form submission with data:', {
      formData,
      selectedSlot,
      isSubmitting
    });
    
    if (validateForm()) {
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      console.log('✅ Form validation passed, contact data:', contactData);
      
      // Mettre à jour les informations de contact d'abord
      onContactUpdate(contactData);
      
      // Passer les données de contact directement à onSubmit
      console.log('🎯 Calling onSubmit with contact data');
      await onSubmit(contactData);
    } else {
      console.log('❌ Form validation failed');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('finalizeOrder')}</h2>
        <p className="text-gray-600">{t('contactInfoDescription')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>{t('contactInformation')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('fullName')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('yourName')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">{t('phone')} *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+41 79 123 45 67"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{t('finalSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div>
                <h4 className="font-medium text-sm mb-1">{t('address')}</h4>
                <p className="text-sm text-gray-600">{address?.place_name}</p>
              </div>

              {/* Schedule */}
              {selectedSlot && (
                <div>
                  <h4 className="font-medium text-sm mb-1">{t('dateTime')}</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedSlot.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedSlot.period === 'morning' ? '09h00-12h00' : '14h00-17h00'}
                  </p>
                </div>
              )}

              {/* Services */}
              <div>
                <h4 className="font-medium text-sm mb-2">{t('servicesCount').replace('{0}', String(cartItems.length))}</h4>
                <div className="space-y-2">
                  {cartItems.map((item) => {
                    // Construire le nom du service avec les détails
                    let serviceName = item.service.name;
                    
                    // Ajouter le pack pour le nettoyage véhicule
                    if (item.service.id === 'nettoyage-vehicule' && item.formData?.pack) {
                      serviceName += ` (Pack ${item.formData.pack})`;
                    }
                    
                    // Ajouter d'autres détails selon le service
                    if (item.service.id === 'nettoyage-matelas' && item.formData?.matressSize) {
                      serviceName += ` (${item.formData.matressSize} cm)`;
                    }
                    
                    if (item.service.id === 'nettoyage-canape' && item.formData?.places) {
                      serviceName += ` (${item.formData.places} place${item.formData.places > 1 ? 's' : ''})`;
                    }

                    if (item.service.id === 'nettoyage-terrasse' && item.formData?.surfaceType) {
                      serviceName += ` (${item.formData.surfaceType})`;
                    }

                    const servicesOnQuote = ['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'];
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate">{serviceName}</span>
                        <span className="font-medium">
                          {servicesOnQuote.includes(item.service.id) ? t('onQuote') : `${item.estimatedPrice} CHF`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>{t('total')}</span>
                  <span className="text-primary">{totalPrice} CHF</span>
                </div>
                {cartItems.some(item => ['nettoyage-terrasse', 'nettoyage-toiture', 'autres-services', 'nettoyage-vitres', 'nettoyage-moquette-tapis'].includes(item.service.id)) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('quoteServicesNote')}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? t('confirming') : t('confirmReservation')}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {t('confirmationEmail')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 rounded-lg border border-gray-300 hover:border-gray-400 font-medium"
        >
          {t('backToSchedule')}
        </button>
      </div>
    </div>
  );
};