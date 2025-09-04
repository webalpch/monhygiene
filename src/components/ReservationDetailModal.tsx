import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  FileText, 
  Settings,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reservation } from '@/types/database';
import { formatServiceName } from '@/utils/serviceNameFormatter';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

// Fonction pour formater les détails de service
const formatServiceDetail = (key: string, value: any): { label: string; displayValue: string } => {
  let label = "";
  let displayValue = "";
  
  // Gestion des différents types de valeurs
  if (value === null || value === undefined) {
    return { label: "", displayValue: "" };
  }
  
  // Gestion des objets et tableaux
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else {
      // Pour les objets, essayer d'extraire des propriétés utiles
      if (value.name) displayValue = value.name;
      else if (value.label) displayValue = value.label;
      else if (value.title) displayValue = value.title;
      else if (value.value) displayValue = value.value;
      else displayValue = JSON.stringify(value);
    }
  } else if (typeof value === 'boolean') {
    displayValue = value ? "Oui" : "Non";
  } else {
    displayValue = String(value);
  }
  
  switch (key) {
    case "pack":
      label = "Pack";
      break;
    case "numberOfSeats":
      label = "Nombre de places";
      break;
    case "matressSize":
      label = "Taille";
      displayValue = typeof value === 'object' ? displayValue : `${value} cm`;
      break;
    case "numberOfMatresses":
      label = "Quantité";
      break;
    case "numberOfRooms":
      label = "Nombre de pièces";
      break;
    case "surface":
      label = "Surface";
      displayValue = typeof value === 'object' ? displayValue : `${value} m²`;
      break;
    case "surfaceType":
      label = "Type de revêtement";
      break;
    case "frequency":
      label = "Fréquence";
      if (typeof value === 'string') {
        displayValue = value === "weekly" ? "Hebdomadaire" : 
                      value === "monthly" ? "Mensuel" : 
                      value === "once" ? "Ponctuel" : value;
      }
      break;
    case "hasDeepCleaning":
      if (value === true) {
        label = "Option supplémentaire";
        displayValue = "Nettoyage en profondeur";
      } else {
        return { label: "", displayValue: "" };
      }
      break;
    case "hasWindowCleaning":
      if (value === true) {
        label = "Option supplémentaire";
        displayValue = "Nettoyage des vitres";
      } else {
        return { label: "", displayValue: "" };
      }
      break;
    case "notes":
      label = "Notes";
      break;
    case "size":
      label = "Taille";
      break;
    case "color":
    case "colour":
      label = "Couleur";
      break;
    case "type":
      label = "Type";
      break;
    case "vehicleType":
      label = "Type de véhicule";
      break;
    case "quantity":
      label = "Quantité";
      break;
    case "dimensions":
      label = "Dimensions";
      break;
    case "material":
      label = "Matériau";
      break;
    case "brand":
      label = "Marque";
      break;
    case "model":
      label = "Modèle";
      break;
    case "options":
      label = "Options supplémentaires";
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      }
      break;
    case "services":
      label = "Services inclus";
      break;
    case "traitementOzone":
      label = "Traitement à l'ozone";
      displayValue = value ? "Oui" : "Non";
      break;
    case "poilsAnimaux":
      label = "Poils d'animaux";
      displayValue = value ? "Oui" : "Non";
      break;
    case "priseElectrique":
      label = "Prise électrique";
      displayValue = value ? "Disponible" : "Non disponible";
      break;
    case "accesMobile":
      label = "Accès mobile";
      displayValue = value ? "Disponible" : "Non disponible";
      break;
    default:
      // Formatage automatique des clés en camelCase
      label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  
  return { label, displayValue };
};

export const ReservationDetailModal = ({ isOpen, onClose, reservation }: ReservationDetailModalProps) => {
  if (!reservation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent p-3 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-lg sm:text-2xl font-bold pr-2">
            Détails de la réservation
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 pt-4">
          {/* Informations client */}
          <div className="card-elegant p-3 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Informations client</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium text-sm sm:text-lg break-words">{reservation.client_name}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium text-sm sm:text-base break-all">{reservation.client_email}</p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Téléphone</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium text-sm sm:text-base">{reservation.client_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="card-elegant p-3 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Adresse</h3>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-lg break-words">{reservation.address}</p>
              <p className="text-sm sm:text-base text-muted-foreground">
                {reservation.postcode} {reservation.city}
              </p>
              {reservation.coordinates && (
                <p className="text-xs sm:text-sm text-muted-foreground break-all">
                  Coordonnées: {reservation.coordinates[1]}, {reservation.coordinates[0]}
                </p>
              )}
            </div>
          </div>

          {/* Service et planification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="card-elegant p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">Service</h3>
              </div>
              <div className="space-y-4">
                {/* Affichage des services */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg text-slate-800 border-b border-slate-200 pb-2">
                    Services réservés
                  </h4>
                  
                  {/* Vérification si réservation multi-services */}
                  {(reservation as any)?.services && Array.isArray((reservation as any).services) ? (
                    // Réservation multi-services - chaque service séparé
                    <div className="space-y-6">
                      {(reservation as any).services.map((service: any, index: number) => (
                        <div key={index} className="relative">
                          {/* Numéro du service */}
                          <div className="absolute -left-2 -top-2 bg-primary text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center z-10">
                            {index + 1}
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm ml-4">
                            {/* Nom du service */}
                            <h5 className="font-bold text-2xl text-blue-800 mb-4">
                              {service.service_name}
                            </h5>
                            
                            {/* Détails spécifiques du service */}
                            {service.form_data && Object.keys(service.form_data).length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {Object.entries(service.form_data)
                                  .filter(([key, value]) => {
                                    // Filtrer seulement les valeurs vides
                                    if (value === null || value === undefined || value === "") return false;
                                    return true;
                                  })
                                  .map(([key, value]) => {
                                    const { label, displayValue } = formatServiceDetail(key, value);
                                    
                                    return label ? (
                                      <div key={key} className="bg-white/90 rounded-lg p-4 border border-blue-100 shadow-sm">
                                        <div className="flex flex-col space-y-1">
                                          <span className="font-medium text-sm text-slate-600 uppercase tracking-wide">{label}</span>
                                          <span className="font-bold text-lg text-blue-900">{displayValue}</span>
                                        </div>
                                      </div>
                                    ) : null;
                                  })}
                              </div>
                            )}
                            
                            {/* Prix du service */}
                            {service.estimated_price && (
                              <div className="flex justify-end">
                                <span className="bg-green-100 text-green-800 font-bold px-6 py-3 rounded-full text-lg shadow-sm">
                                  {service.estimated_price} CHF
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Service unique
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
                      {/* Nom du service */}
                      <h5 className="font-bold text-2xl text-blue-800 mb-4">
                        {reservation.service_type}
                      </h5>
                      
                      {/* Détails spécifiques du service */}
                      {reservation.service_details && Object.keys(reservation.service_details).length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {Object.entries(reservation.service_details)
                            .filter(([key, value]) => {
                              // Filtrer seulement les valeurs vides
                              if (value === null || value === undefined || value === "") return false;
                              return true;
                            })
                            .map(([key, value]) => {
                              const { label, displayValue } = formatServiceDetail(key, value);
                              
                              return label ? (
                                <div key={key} className="bg-white/90 rounded-lg p-4 border border-blue-100 shadow-sm">
                                  <div className="flex flex-col space-y-1">
                                    <span className="font-medium text-sm text-slate-600 uppercase tracking-wide">{label}</span>
                                    <span className="font-bold text-lg text-blue-900">{displayValue}</span>
                                  </div>
                                </div>
                              ) : null;
                            })}
                        </div>
                      )}
                      
                      {/* Prix estimé */}
                      {reservation.estimated_price && (
                        <div className="flex justify-end">
                          <span className="bg-green-100 text-green-800 font-bold px-6 py-3 rounded-full text-lg shadow-sm">
                            {reservation.estimated_price} CHF
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                  
                <div className="flex items-center space-x-2 text-muted-foreground bg-gray-50 p-3 rounded-lg">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Durée estimée: {reservation.duration_minutes} minutes</span>
                </div>
              </div>
            </div>

            <div className="card-elegant p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">Planification</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-sm sm:text-lg break-words">
                    {format(new Date(reservation.scheduled_date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Heure</p>
                  <p className="font-medium text-sm sm:text-lg">{reservation.scheduled_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="card-elegant p-3 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Statut</h3>
            </div>
            <Badge className={`${getStatusColor(reservation.status)} px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border inline-block`}>
              {getStatusText(reservation.status)}
            </Badge>
          </div>

          {/* Notes */}
          {(reservation.notes || reservation.internal_notes) && (
            <div className="card-elegant p-3 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">Notes</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {reservation.notes && (
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Notes client</p>
                    <p className="text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-lg break-words">{reservation.notes}</p>
                  </div>
                )}
                {reservation.internal_notes && (
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Notes internes</p>
                    <p className="text-xs sm:text-sm bg-yellow-50 p-2 sm:p-3 rounded-lg text-gray-700 break-words">{reservation.internal_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates de création et modification */}
          <div className="card-elegant p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div>
                <p>Créé le</p>
                <p className="font-medium break-words">
                  {format(new Date(reservation.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
              <div>
                <p>Modifié le</p>
                <p className="font-medium break-words">
                  {format(new Date(reservation.updated_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};