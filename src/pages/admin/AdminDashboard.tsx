import { useReservations } from "@/hooks/useReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, Users, Clock, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ReservationDetail } from "@/hooks/useReservations";

// Configure les mois et jours en français
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Composant calendrier custom
function CustomCalendar({ reservations, onReservationClick }: { 
  reservations: ReservationDetail[], 
  onReservationClick: (reservation: ReservationDetail) => void 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const goToPrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getReservationsForDate = (date: Date) => {
    // Utiliser le format local au lieu d'UTC pour éviter les décalages de fuseau horaire
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return reservations.filter(r => r.scheduled_date === dateString);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    // Générer 6 semaines pour couvrir tous les cas
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = current.getMonth() === month;
        const isToday = current.toDateString() === new Date().toDateString();
        const dayReservations = getReservationsForDate(current);

        weekDays.push(
          <div 
            key={current.toISOString()} 
            className={`min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] border border-gray-200 p-1 sm:p-2 ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
            } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
          >
            <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
              {current.getDate()}
            </div>
            <div className="space-y-1 overflow-hidden">
              {dayReservations.slice(0, 3).map((reservation, idx) => (
                <div
                  key={reservation.id}
                  onClick={() => onReservationClick(reservation)}
                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate ${
                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    reservation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  <div className="font-medium">{reservation.scheduled_time}</div>
                  <div className="truncate">{reservation.client_name}</div>
                </div>
              ))}
              {dayReservations.length > 3 && (
                <div className="text-xs text-gray-500 p-1">
                  +{dayReservations.length - 3} autres
                </div>
              )}
            </div>
          </div>
        );
        current.setDate(current.getDate() + 1);
      }
      days.push(
        <div key={week} className="grid grid-cols-7 gap-0">
          {weekDays}
        </div>
      );
    }

    return (
      <div className="space-y-0">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-600 p-2 border-b">
              {day}
            </div>
          ))}
        </div>
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const isToday = day.toDateString() === new Date().toDateString();
      const dayReservations = getReservationsForDate(day);

      days.push(
        <div key={i} className={`border border-gray-200 p-2 sm:p-4 min-h-[200px] ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
          <div className={`text-sm sm:text-base font-medium mb-3 text-center ${isToday ? 'text-blue-600' : ''}`}>
            <div className="text-xs text-gray-500">{dayNames[i]}</div>
            <div>{day.getDate()}</div>
          </div>
          <div className="space-y-2">
            {dayReservations.map((reservation) => (
              <div
                key={reservation.id}
                onClick={() => onReservationClick(reservation)}
                className={`text-xs sm:text-sm p-2 rounded cursor-pointer hover:opacity-80 ${
                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  reservation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-medium">{reservation.scheduled_time}</div>
                <div className="truncate">{reservation.client_name}</div>
                <div className="text-xs opacity-75 truncate">{reservation.service_type}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-1 sm:gap-0">
        {days}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 min-w-[120px] sm:min-w-[150px] lg:min-w-[200px] text-center px-2">
              {view === 'month' 
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `Semaine du ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              }
            </h2>
            <Button variant="outline" size="sm" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={goToToday} size="sm" className="w-full sm:w-auto">
            Aujourd'hui
          </Button>
        </div>
        
        <div className="flex justify-center space-x-0.5 sm:space-x-1">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
            className="flex-1 sm:flex-none"
          >
            Mois
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
            className="flex-1 sm:flex-none"
          >
            Semaine
          </Button>
        </div>
      </div>

      {/* Calendar content */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { reservations, isLoading } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetail | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  // Convertir les réservations confirmées
  const confirmedReservations = reservations.filter(r => 
    r.status === 'confirmed' || r.status === 'in_progress' || r.status === 'completed'
  );

  // Statistiques rapides
  const stats = {
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: confirmedReservations.length,
    today: (() => {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return reservations.filter(r => r.scheduled_date === todayString).length;
    })()
  };

  const formatServiceDetails = (formData: Record<string, any>, serviceName: string) => {
    if (!formData || Object.keys(formData).length === 0) return "Aucun détail spécifique";
    
    const formatKey = (k: string, serviceType: string) => {
      // Mapping spécifique par type de service
      if (serviceType.toLowerCase().includes('véhicule') || serviceType.toLowerCase().includes('vehicule')) {
        const vehicleKeyMap: Record<string, string> = {
          'pack': 'Pack sélectionné',
          'vehicleType': 'Taille véhicule',
          'poilsAnimaux': 'Poils d\'animaux',
          'accessType': 'Accès véhicule'
        };
        return vehicleKeyMap[k] || k;
      }
      
      if (serviceType.toLowerCase().includes('canapé') || serviceType.toLowerCase().includes('canape')) {
        const canapeKeyMap: Record<string, string> = {
          'numberOfSeats': 'Nombre de places',
          'places': 'Nombre de places',
          'pack': 'Pack sélectionné'
        };
        return canapeKeyMap[k] || k;
      }
      
      if (serviceType.toLowerCase().includes('matelas')) {
        const matelasKeyMap: Record<string, string> = {
          'matressSize': 'Taille matelas (cm)',
          'pack': 'Pack sélectionné'
        };
        return matelasKeyMap[k] || k;
      }
      
      if (serviceType.toLowerCase().includes('sièges') || serviceType.toLowerCase().includes('sieges')) {
        const siegesKeyMap: Record<string, string> = {
          'numberOfSeats': 'Nombre de sièges',
          'places': 'Nombre de sièges',
          'pack': 'Pack sélectionné'
        };
        return siegesKeyMap[k] || k;
      }
      
      // Mapping général pour autres services
      const generalKeyMap: Record<string, string> = {
        'pack': 'Pack sélectionné',
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
        'timePreference': 'Préférence horaire'
      };
      return generalKeyMap[k] || k;
    };

    return Object.entries(formData)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => {
        const formattedValue = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value;
        return `${formatKey(key, serviceName)}: ${formattedValue}`;
      })
      .join(' • ');
  };

  return (
    <div className="p-2 sm:p-3 lg:p-4 xl:p-6 space-y-3 sm:space-y-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Calendrier des Réservations
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">
          Cliquez sur une réservation pour voir les détails
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 text-xs sm:text-sm font-medium">En attente</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 text-xs sm:text-sm font-medium">Confirmées</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{stats.confirmed}</p>
              </div>
              <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 text-xs sm:text-sm font-medium">Aujourd'hui</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.today}</p>
              </div>
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="shadow-lg">
        <CardContent className="p-1 sm:p-2 lg:p-4 xl:p-6">
          <CustomCalendar reservations={confirmedReservations} onReservationClick={setSelectedReservation} />
        </CardContent>
      </Card>

      {/* Reservation Details Modal */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-xl font-bold">
              Détails - {selectedReservation?.client_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4 sm:space-y-6">
              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge className={
                    selectedReservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedReservation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    selectedReservation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedReservation.status}
                  </Badge>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {selectedReservation.estimated_price.toFixed(2)} CHF
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Client Info */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg">Informations client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-center">
                      <strong className="w-12 sm:w-16 text-xs sm:text-sm">Nom:</strong>
                      <span className="text-xs sm:text-sm">{selectedReservation.client_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
                      <strong className="w-12 sm:w-16 text-xs sm:text-sm">Email:</strong>
                      <span className="text-xs sm:text-sm break-all">{selectedReservation.client_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
                      <strong className="w-12 sm:w-16 text-xs sm:text-sm">Tél:</strong>
                      <span className="text-xs sm:text-sm">{selectedReservation.client_phone}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule & Address */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg">Rendez-vous</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-center">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
                      <span className="text-xs sm:text-sm">
                        {new Date(selectedReservation.scheduled_date).toLocaleDateString('fr-FR')} à {selectedReservation.scheduled_time}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 mt-0.5" />
                      <div className="text-xs sm:text-sm">
                        <p>{selectedReservation.address}</p>
                        <p className="text-gray-600">{selectedReservation.postcode} {selectedReservation.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Services Details */}
              {(!selectedReservation.services || selectedReservation.services.length === 0) ? (
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Services réservés</h4>
                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                    <p className="text-red-700 font-medium">⚠️ Aucun détail de service trouvé</p>
                    <p className="text-red-600 text-sm mt-2">
                      Service principal enregistré: <strong>{selectedReservation.service_type}</strong>
                    </p>
                    <p className="text-red-500 text-xs mt-1">
                      Les détails des services et options ne sont pas disponibles pour cette réservation.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Services réservés</h4>
                  <div className="grid gap-4">
                    {selectedReservation.services.map((service, index) => (
                      <Card key={index} className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-bold text-lg text-primary">{service.service_name}</h5>
                            <Badge className="bg-green-100 text-green-800 font-bold text-base px-3 py-1">
                              {service.estimated_price?.toFixed(2)} CHF
                            </Badge>
                          </div>
                          

                          {service.form_data && Object.keys(service.form_data).length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                              {(() => {
                                // Déterminer les champs pertinents selon le type de service
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
                                  
                                  return Object.keys(service.form_data);
                                };

                                const formatKey = (k: string, serviceType: string) => {
                                  if (serviceType.toLowerCase().includes('véhicule') || serviceType.toLowerCase().includes('vehicule')) {
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
                                  
                                  if (serviceType.toLowerCase().includes('canapé') || serviceType.toLowerCase().includes('canape')) {
                                    const canapeKeyMap: Record<string, string> = {
                                      'numberOfSeats': 'Nombre de places',
                                      'places': 'Nombre de places',
                                      'pack': 'Pack sélectionné',
                                      'traitementOzone': 'Traitement à l\'ozone',
                                      'options': 'Options supplémentaires'
                                    };
                                    return canapeKeyMap[k] || k;
                                  }
                                  
                                  if (serviceType.toLowerCase().includes('matelas')) {
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
                                    'roofType': 'Type de toiture',
                                    'vehicleType': 'Type de véhicule',
                                    'traitementOzone': 'Traitement à l\'ozone',
                                    'options': 'Options supplémentaires'
                                  };
                                  return generalKeyMap[k] || k;
                                };

                                const relevantFields = getRelevantFields(service.service_name);

                                return Object.entries(service.form_data)
                                  .filter(([key, value]) => 
                                    relevantFields.includes(key) &&
                                    value !== null && 
                                    value !== undefined && 
                                    value !== ''
                                  )
                                  .map(([key, value]) => {
                                    const formattedValue = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value);
                                    
                                    return (
                                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                                        <span className="font-medium text-gray-700">{formatKey(key, service.service_name)}</span>
                                        <span className="text-gray-900 font-semibold">
                                          {formattedValue}
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}