import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Eye,
  Trash2,
  Loader2,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ReservationDetail } from "@/hooks/useReservations";

interface ReservationCardProps {
  reservation: ReservationDetail;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onPaymentStatusUpdate: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}

export function ReservationCard({ 
  reservation, 
  onStatusUpdate, 
  onPaymentStatusUpdate, 
  onDelete, 
  isUpdating 
}: ReservationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatServiceDetails = (formData: Record<string, any>, serviceName: string) => {
    if (!formData || Object.keys(formData).length === 0) return null;
    
    const getRelevantFields = (serviceType: string): string[] => {
      const lower = serviceType.toLowerCase();
      
      if (lower.includes('véhicule') || lower.includes('vehicule')) {
        return ['pack', 'vehicleType', 'poilsAnimaux', 'accessType', 'priseElectrique', 'accesMobile', 'traitementOzone', 'options'];
      }
      
      if (lower.includes('canapé') || lower.includes('canape')) {
        return ['numberOfSeats', 'places', 'pack', 'traitementOzone', 'options'];
      }
      
      if (lower.includes('matelas')) {
        return ['matressSize', 'pack', 'traitementOzone', 'options'];
      }
      
      if (lower.includes('sièges') || lower.includes('sieges')) {
        return ['numberOfSeats', 'places', 'pack', 'traitementOzone', 'options'];
      }
      
      if (lower.includes('billard')) {
        return ['surface', 'pack', 'traitementOzone', 'options'];
      }
      
      if (lower.includes('toiture')) {
        return ['roofType', 'surface', 'accessType', 'options'];
      }
      
      if (lower.includes('vitres')) {
        return ['surface', 'buildingFloors', 'accessDifficulty', 'options'];
      }

      if (lower.includes('terrasse')) {
        return ['surface', 'surfaceType', 'accessType', 'options'];
      }

      if (lower.includes('moquette') || lower.includes('tapis')) {
        return ['surface', 'numberOfRooms', 'roomType', 'options'];
      }
      
      // Pour les autres services, on garde tous les champs
      return Object.keys(formData);
    };
    
    const formatKey = (k: string, serviceType: string) => {
      const lower = serviceType.toLowerCase();
      
      if (lower.includes('véhicule') || lower.includes('vehicule')) {
        const vehicleKeyMap: Record<string, string> = {
          'pack': 'Pack',
          'vehicleType': 'Taille véhicule',
          'poilsAnimaux': 'Poils d\'animaux',
          'accessType': 'Accès véhicule',
          'priseElectrique': 'Prise électrique',
          'accesMobile': 'Accès mobile',
          'traitementOzone': 'Traitement à l\'ozone',
          'options': 'Options supplémentaires'
        };
        return vehicleKeyMap[k] || k;
      }
      
      if (lower.includes('canapé') || lower.includes('canape')) {
        const canapeKeyMap: Record<string, string> = {
          'numberOfSeats': 'Nombre de places',
          'places': 'Nombre de places',
          'pack': 'Pack',
          'traitementOzone': 'Traitement à l\'ozone',
          'options': 'Options supplémentaires'
        };
        return canapeKeyMap[k] || k;
      }
      
      if (lower.includes('matelas')) {
        const matelasKeyMap: Record<string, string> = {
          'matressSize': 'Taille matelas (cm)',
          'pack': 'Pack',
          'traitementOzone': 'Traitement à l\'ozone',
          'options': 'Options supplémentaires'
        };
        return matelasKeyMap[k] || k;
      }
      
      // Mapping général
      const generalKeyMap: Record<string, string> = {
        'pack': 'Pack',
        'numberOfSeats': 'Nombre de places',
        'places': 'Nombre de places',
        'surface': 'Surface (m²)',
        'numberOfRooms': 'Nombre de pièces',
        'surfaceType': 'Type de surface',
        'roomType': 'Type de pièce',
        'accessType': 'Type d\'accès',
        'roofType': 'Type de toiture',
        'vehicleType': 'Type de véhicule',
        'windows': 'Fenêtres',
        'buildingFloors': 'Étages du bâtiment',
        'accessDifficulty': 'Difficulté d\'accès',
        'timePreference': 'Préférence horaire',
        'traitementOzone': 'Traitement à l\'ozone',
        'options': 'Options supplémentaires'
      };
      return generalKeyMap[k] || k;
    };

    const relevantFields = getRelevantFields(serviceName);
    
    return Object.entries(formData)
      .filter(([key, value]) => 
        relevantFields.includes(key) && 
        value !== null && 
        value !== undefined && 
        value !== ''
      )
      .map(([key, value]) => {
        const formattedValue = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value;
        return `${formatKey(key, serviceName)}: ${formattedValue}`;
      })
      .join(' • ');
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow w-full">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {reservation.client_name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{format(new Date(reservation.scheduled_date), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>{reservation.scheduled_time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{reservation.city}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Badge className={`${getStatusColor(reservation.status)} text-xs`}>
                {reservation.status}
              </Badge>
            </div>
          </div>

          {/* Services */}
          <div className="mb-3 sm:mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Services réservés</h4>
            {(!reservation.services || reservation.services.length === 0) ? (
              <div className="bg-red-50 border border-red-200 p-2 sm:p-3 rounded-lg">
                <p className="text-red-700 text-xs sm:text-sm font-medium">
                  ⚠️ Aucun service détaillé trouvé
                </p>
                <p className="text-red-600 text-xs mt-1">
                  Service: {reservation.service_type}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {reservation.services.map((service, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 p-2 sm:p-3 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <span className="font-semibold text-blue-900 break-words text-sm sm:text-base">{service.service_name}</span>
                      <span className="text-primary font-bold text-base sm:text-lg flex-shrink-0">
                        {service.estimated_price?.toFixed(2)} CHF
                      </span>
                    </div>
                    {service.form_data && Object.keys(service.form_data).length > 0 && (
                      <div className="bg-white p-1.5 sm:p-2 rounded border">
                        <p className="text-xs font-medium text-gray-700 mb-1">Options:</p>
                        <p className="text-xs text-gray-600 break-words">
                          {formatServiceDetails(service.form_data, service.service_name)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-base sm:text-lg font-bold text-primary">
              Total: {reservation.estimated_price.toFixed(2)} CHF
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center">
              <Select 
                value={reservation.status} 
                onValueChange={(value) => onStatusUpdate(reservation.id, value)}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full sm:w-32 bg-white text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md z-50">
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(true)}
                className="flex-1 sm:flex-none"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Détails</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(reservation.id)}
                disabled={isUpdating}
                className="flex-1 sm:flex-none"
              >
                {isUpdating ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm text-red-500">Supprimer</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Détails de la réservation - {reservation.client_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Info */}
              <div>
                <h4 className="font-semibold mb-3 text-lg">Informations client</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <strong className="w-20">Nom:</strong>
                    <span>{reservation.client_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <strong className="w-20">Email:</strong>
                    <span>{reservation.client_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <strong className="w-20">Tél:</strong>
                    <span>{reservation.client_phone}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-semibold mb-3 text-lg">Adresse d'intervention</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{reservation.address}</p>
                  <p>{reservation.postcode} {reservation.city}</p>
                </div>
              </div>
            </div>

            {/* Services Details */}
            {reservation.services && reservation.services.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Services détaillés</h4>
                <div className="grid gap-4">
                  {reservation.services.map((service, index) => (
                    <Card key={index} className="border-2 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-bold text-lg text-primary">{service.service_name}</h5>
                          <Badge className="bg-green-100 text-green-800 font-bold text-lg px-3 py-1">
                            {service.estimated_price?.toFixed(2)} CHF
                          </Badge>
                        </div>
                        
                        {service.form_data && Object.keys(service.form_data).length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(() => {
                              const relevantFields = (() => {
                                const lower = service.service_name?.toLowerCase() || '';
                                
                                if (lower.includes('véhicule') || lower.includes('vehicule')) {
                                  return ['pack', 'vehicleType', 'poilsAnimaux', 'accessType', 'priseElectrique', 'accesMobile', 'traitementOzone', 'options'];
                                }
                                
                                if (lower.includes('canapé') || lower.includes('canape')) {
                                  return ['numberOfSeats', 'places', 'pack', 'traitementOzone', 'options'];
                                }
                                
                                if (lower.includes('matelas')) {
                                  return ['matressSize', 'pack', 'traitementOzone', 'options'];
                                }
                                
                                if (lower.includes('sièges') || lower.includes('sieges')) {
                                  return ['numberOfSeats', 'places', 'pack', 'traitementOzone', 'options'];
                                }
                                
                                if (lower.includes('billard')) {
                                  return ['surface', 'pack', 'traitementOzone', 'options'];
                                }
                                
                                if (lower.includes('toiture')) {
                                  return ['roofType', 'surface', 'accessType', 'options'];
                                }

                                if (lower.includes('vitres')) {
                                  return ['surface', 'buildingFloors', 'accessDifficulty', 'options'];
                                }

                                if (lower.includes('terrasse')) {
                                  return ['surface', 'surfaceType', 'accessType', 'options'];
                                }

                                if (lower.includes('moquette') || lower.includes('tapis')) {
                                  return ['surface', 'numberOfRooms', 'roomType', 'options'];
                                }
                                
                                return Object.keys(service.form_data);
                              })();

                              return Object.entries(service.form_data)
                                .filter(([key, value]) => 
                                  relevantFields.includes(key) && 
                                  value !== null && 
                                  value !== undefined && 
                                  value !== ''
                                )
                                .map(([key, value]) => {
                                  const formatKey = (k: string) => {
                                    const serviceName = service.service_name?.toLowerCase() || '';
                                    
                                if (serviceName.includes('véhicule') || serviceName.includes('vehicule')) {
                                  const vehicleKeyMap: Record<string, string> = {
                                    'pack': 'Pack sélectionné',
                                    'vehicleType': 'Taille véhicule',
                                    'poilsAnimaux': 'Poils d\'animaux',
                                    'accessType': 'Accès véhicule',
                                    'priseElectrique': 'Prise électrique',
                                    'accesMobile': 'Accès mobile',
                                    'traitementOzone': 'Traitement à l\'ozone',
                                    'options': 'Options supplémentaires'
                                  };
                                  return vehicleKeyMap[k] || k;
                                }
                                
                                if (serviceName.includes('canapé') || serviceName.includes('canape')) {
                                  const canapeKeyMap: Record<string, string> = {
                                    'numberOfSeats': 'Nombre de places',
                                    'places': 'Nombre de places',
                                    'pack': 'Pack sélectionné',
                                    'traitementOzone': 'Traitement à l\'ozone',
                                    'options': 'Options supplémentaires'
                                  };
                                  return canapeKeyMap[k] || k;
                                }
                                
                                if (serviceName.includes('matelas')) {
                                  const matelasKeyMap: Record<string, string> = {
                                    'matressSize': 'Taille matelas (cm)',
                                    'pack': 'Pack sélectionné',
                                    'traitementOzone': 'Traitement à l\'ozone',
                                    'options': 'Options supplémentaires'
                                  };
                                  return matelasKeyMap[k] || k;
                                }
                                
                                const generalKeyMap: Record<string, string> = {
                                  'pack': 'Pack sélectionné',
                                  'numberOfSeats': 'Nombre de places',
                                  'places': 'Nombre de places',
                                  'surface': 'Surface (m²)',
                                      'numberOfRooms': 'Nombre de pièces',
                                      'surfaceType': 'Type de surface',
                                      'roomType': 'Type de pièce',
                                      'accessType': 'Type d\'accès',
                                      'vehicleType': 'Type de véhicule',
                                      'roofType': 'Type de toiture',
                                      'windows': 'Fenêtres',
                                      'buildingFloors': 'Étages du bâtiment',
                                      'accessDifficulty': 'Difficulté d\'accès',
                                      'timePreference': 'Préférence horaire'
                                    };
                                    return generalKeyMap[k] || k;
                                  };
                                  
                                  return (
                                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded border">
                                      <span className="font-medium text-gray-700">{formatKey(key)}</span>
                                      <span className="text-gray-900 font-semibold">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </span>
                                    </div>
                                  );
                                });
                            })()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}