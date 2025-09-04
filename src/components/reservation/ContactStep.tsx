
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact, ReservationDraft } from '@/types/reservation';
import { SERVICES } from '@/data/services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Calendar, Briefcase, User, Mail, Phone } from 'lucide-react';

interface ContactStepProps {
  draft: ReservationDraft;
  onContactUpdate: (contact: Contact) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const ContactStep = ({ draft, onContactUpdate, onSubmit, onBack }: ContactStepProps) => {
  const [contact, setContact] = useState<Contact>(draft.contact);
  const [loading, setLoading] = useState(false);

  const service = SERVICES.find(s => s.id === draft.serviceId);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Swiss phone number validation (simplified)
    return /^(\+41|0)[0-9\s]{8,}$/.test(phone.replace(/\s/g, ''));
  };

  const handleContactChange = (field: keyof Contact, value: string) => {
    const updated = { ...contact, [field]: value };
    setContact(updated);
    onContactUpdate(updated);
  };

  const canSubmit = contact.name.trim() && 
                   validateEmail(contact.email) && 
                   validatePhone(contact.phone);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Confirmez votre réservation
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Vérifiez les détails et laissez-nous vos coordonnées
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 sm:p-6 border border-primary/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Récapitulatif de votre commande</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {draft.address && (
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-primary mb-1 text-sm sm:text-base">Adresse d'intervention</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base break-words">{draft.address.place_name}</div>
                  </div>
                </div>
              </div>
            )}

            {service && (
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-primary mb-1 text-sm sm:text-base">Service sélectionné</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base">{service.name}</div>
                    {service.description && (
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">{service.description}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {draft.slot && (
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-primary mb-1 text-sm sm:text-base">Rendez-vous</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base">
                      {format(draft.slot.date, 'EEEE d MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-primary font-semibold text-base sm:text-lg">
                      {draft.slot.label}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {Object.keys(draft.subThemes).length > 0 && (
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="font-semibold text-primary mb-3 text-sm sm:text-base">Options sélectionnées</div>
                <div className="space-y-2">
                  {Object.entries(draft.subThemes).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between items-center bg-gray-50 rounded-lg p-2 sm:p-3">
                        <span className="font-medium text-gray-700 capitalize text-xs sm:text-sm">
                          {key.replace('_', ' ').replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="text-primary font-semibold text-xs sm:text-sm">
                          {String(value)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Vos coordonnées</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center text-sm sm:text-base font-medium">
                <User className="h-4 w-4 mr-2" />
                Nom complet *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom et prénom"
                value={contact.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                className="mt-2 h-10 sm:h-12 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center text-sm sm:text-base font-medium">
                <Mail className="h-4 w-4 mr-2" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="mt-2 h-10 sm:h-12 text-sm sm:text-base"
                required
              />
              {contact.email && !validateEmail(contact.email) && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">Format d'email invalide</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center text-sm sm:text-base font-medium">
                <Phone className="h-4 w-4 mr-2" />
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+41 XX XXX XX XX"
                value={contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="mt-2 h-10 sm:h-12 text-sm sm:text-base"
                required
              />
              {contact.phone && !validatePhone(contact.phone) && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">Numéro de téléphone suisse invalide</p>
              )}
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="text-xs sm:text-sm text-gray-500">
                En confirmant, vous acceptez d'être contacté pour finaliser votre réservation.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 mb-6 sm:mb-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base lg:text-lg rounded-2xl order-2 sm:order-1"
        >
          Retour
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-3 text-sm sm:text-base lg:text-lg rounded-2xl disabled:opacity-50 order-1 sm:order-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Confirmation...
            </>
          ) : (
            'Confirmer ma réservation'
          )}
        </Button>
      </div>
    </div>
  );
};
