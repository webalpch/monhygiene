
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, MapPin, Calendar, Briefcase, User, Mail, Phone } from 'lucide-react';
import { useReservation } from '@/hooks/useReservation';
import { SERVICES } from '@/data/services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewReservation: () => void;
  reservationId?: string;
}

export const SuccessModal = ({ isOpen, onClose, onNewReservation, reservationId }: SuccessModalProps) => {
  const { draft, clearDraft } = useReservation();
  const [reservationData, setReservationData] = useState<any>(null);
  const service = SERVICES.find(s => s.id === draft.serviceId);

  // Récupérer les données de réservation depuis la base de données
  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId || !isOpen) return;
      
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', reservationId)
          .single();
        
        if (error) throw error;
        setReservationData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
      }
    };

    fetchReservationData();
  }, [reservationId, isOpen]);

  // Utiliser les données de la réservation ou du draft selon ce qui est disponible
  const displayData = reservationData || {
    address: draft.address?.place_name,
    client_name: draft.contact.name,
    client_email: draft.contact.email,
    client_phone: draft.contact.phone,
    scheduled_date: draft.slot?.date,
    scheduled_time: draft.slot?.label,
    service_type: service?.name,
    coordinates: reservationData?.coordinates
  };

  const handleClose = () => {
    clearDraft();
    setReservationData(null);
    onClose();
  };

  const handleNewReservation = () => {
    clearDraft();
    setReservationData(null);
    onNewReservation();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Réservation confirmée !
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Votre demande a été transmise avec succès
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statut */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <div className="text-lg font-semibold text-green-800">
              Statut : Confirmé ✓
            </div>
            <div className="text-sm text-green-700 mt-1">
              Nous vous contacterons sous 24h pour finaliser
            </div>
          </div>
          
          {/* Récapitulatif détaillé */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 sm:p-6 border border-primary/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Récapitulatif de votre réservation</h3>
            
            <div className="space-y-4">
              {(displayData.address || draft.address) && (
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3 flex-shrink-0">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-primary mb-1 text-sm sm:text-base">Adresse d'intervention</div>
                      <div className="text-gray-700 font-medium text-sm sm:text-base break-words">
                        {reservationData ? displayData.address : draft.address?.place_name}
                      </div>
                      {reservationData && displayData.coordinates && (
                        <div className="text-xs text-gray-500 mt-1">
                          Coordonnées: {Array.isArray(displayData.coordinates) 
                            ? `${displayData.coordinates[0]}, ${displayData.coordinates[1]}`
                            : displayData.coordinates
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {service && (
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3 flex-shrink-0">
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-primary mb-1 text-sm sm:text-base">Service sélectionné</div>
                      <div className="text-gray-700 font-medium text-sm sm:text-base">{service.name}</div>
                    </div>
                  </div>
                </div>
              )}

              {draft.slot && (
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3 flex-shrink-0">
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


          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90 text-white w-full sm:flex-1 py-3 rounded-2xl text-base"
            >
              Retour à l'accueil
            </Button>
            <Button
              variant="outline"
              onClick={handleNewReservation}
              className="w-full sm:flex-1 py-3 rounded-2xl text-base border-primary/20"
            >
              Nouvelle réservation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
