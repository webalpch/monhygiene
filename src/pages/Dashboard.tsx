import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useAuth, useReservations, useDashboardStats, useCalendarEvents } from '@/hooks/useSupabase';
import { useNotifications } from '@/hooks/useNotifications';
import { ReservationDetailModal } from '@/components/ReservationDetailModal';
import { 
  CalendarDays, 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp,
  LogOut,
  Eye,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Archive,
  Bell,
  X,
  List,
  Calendar as CalendarIcon,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types/database';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const { user, signOut } = useAuth();
  const { reservations, loading: reservationsLoading } = useReservations();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { events, loading: eventsLoading } = useCalendarEvents(
    (currentMonth.getMonth() + 1).toString(),
    currentMonth.getFullYear()
  );
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleEventClick = (eventId: string) => {
    const reservation = reservations.find(r => r.id === eventId);
    if (reservation) {
      handleReservationClick(reservation);
    }
  };

  // Séparer les réservations actives et archivées
  const today = startOfDay(new Date());
  const activeReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.scheduled_date);
    return !isAfter(today, reservationDate);
  });

  const archivedReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.scheduled_date);
    return isAfter(today, reservationDate);
  });

  const displayedReservations = showArchived ? archivedReservations : activeReservations;

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate('/login');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatServiceDetails = (serviceType: string, serviceDetails: Record<string, any>) => {
    if (!serviceDetails || Object.keys(serviceDetails).length === 0) return null;

    const details = [];
    
    switch (serviceType.toLowerCase()) {
      case 'nettoyage véhicule':
      case 'nettoyage-vehicule':
        if (serviceDetails.pack) {
          details.push(`Pack ${serviceDetails.pack}`);
        }
        break;
        
      case 'nettoyage matelas':
      case 'nettoyage-matelas':
        if (serviceDetails.matressSize) {
          details.push(`Taille: ${serviceDetails.matressSize} cm`);
        }
        if (serviceDetails.numberOfMatresses) {
          details.push(`Quantité: ${serviceDetails.numberOfMatresses} matelas`);
        }
        break;
        
      case 'nettoyage canapé':
      case 'nettoyage-canape':
        if (serviceDetails.numberOfSeats) {
          details.push(`${serviceDetails.numberOfSeats} place(s)`);
        }
        break;
        
      case 'nettoyage domicile':
      case 'nettoyage-domicile':
        if (serviceDetails.numberOfRooms) {
          details.push(`${serviceDetails.numberOfRooms} pièce(s)`);
        }
        if (serviceDetails.hasDeepCleaning) {
          details.push('Nettoyage en profondeur');
        }
        if (serviceDetails.hasWindowCleaning) {
          details.push('Nettoyage vitres');
        }
        break;
        
      case 'nettoyage bureaux':
      case 'nettoyage-bureaux':
        if (serviceDetails.surface) {
          details.push(`${serviceDetails.surface} m²`);
        }
        if (serviceDetails.frequency) {
          const freqText = serviceDetails.frequency === 'weekly' ? 'Hebdomadaire' : 
                          serviceDetails.frequency === 'monthly' ? 'Mensuel' : 'Ponctuel';
          details.push(`Fréquence: ${freqText}`);
        }
        break;
        
      default:
        // Pour les autres services, afficher toutes les clés-valeurs disponibles
        Object.entries(serviceDetails).forEach(([key, value]) => {
          if (value && typeof value !== 'object') {
            details.push(`${key}: ${value}`);
          }
        });
    }
    
    return details.length > 0 ? details : null;
  };

  const selectedDateEvents = events.filter(event => 
    selectedDate && event.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const getDayLoad = (date: Date) => {
    const dayEvents = events.filter(event => 
      event.date === format(date, 'yyyy-MM-dd')
    );
    return dayEvents.length;
  };

  const handleNotificationClick = (notificationId: string, reservation: Reservation) => {
    markAsRead(notificationId);
    setSelectedReservation(reservation);
    setShowDetailModal(true);
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="card-elegant shadow-lg border-b border-primary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-sm sm:text-lg font-bold text-white">MH</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  MonHygiène Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Bienvenue, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative border-primary/20 hover:bg-primary/10 p-2"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>
              
              <Button onClick={handleLogout} variant="outline" className="border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 p-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal - Outside header to avoid stacking context issues */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-[9999998]" 
            onClick={() => setShowNotifications(false)}
            style={{ zIndex: 9999998 }}
          />
          {/* Notification panel */}
          <div 
            className="fixed top-16 sm:top-20 right-2 sm:right-4 w-72 sm:w-80 bg-white rounded-lg shadow-2xl border animate-scale-in max-h-[70vh] overflow-hidden"
            style={{ zIndex: 9999999 }}
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Aucune notification
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id, notification.reservation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(notification.timestamp), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="dashboard-card mb-6">
          <div className="flex items-center justify-between p-4 border-b border-primary/10">
            <div className="flex items-center space-x-1">
              <Button
                variant={activeTab === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('list')}
                className="flex items-center space-x-2 px-4 py-2"
              >
                <List className="h-4 w-4" />
                <span>Liste des réservations</span>
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('calendar')}
                className="flex items-center space-x-2 px-4 py-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Vue calendrier</span>
              </Button>
            </div>
            
            {/* Stats Summary */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">{activeReservations.length}</span>
                <span className="text-muted-foreground">actives</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Archive className="h-4 w-4" />
                <span className="font-medium">{archivedReservations.length}</span>
                <span className="text-muted-foreground">archivées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' ? (
          /* Liste des réservations */
          <div className="space-y-6">
            {/* Filtres */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold">
                  {showArchived ? 'Réservations archivées' : 'Réservations actives'}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={showArchived ? "outline" : "default"}
                    size="sm"
                    onClick={() => setShowArchived(false)}
                    className="flex items-center space-x-1"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Actives ({activeReservations.length})</span>
                  </Button>
                  <Button
                    variant={showArchived ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowArchived(true)}
                    className="flex items-center space-x-1"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Archivées ({archivedReservations.length})</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Liste des réservations */}
            <div className="dashboard-card">
              {reservationsLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {displayedReservations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        Aucune réservation {showArchived ? 'archivée' : 'active'}
                      </p>
                    </div>
                  ) : (
                    displayedReservations.map((reservation) => (
                      <div 
                        key={reservation.id} 
                        className="card-elegant p-6 hover:shadow-lg transition-all duration-300 border border-primary/10 cursor-pointer group"
                        onClick={() => handleReservationClick(reservation)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-bold text-foreground text-xl">{reservation.client_name}</h4>
                              <Badge className={`${getStatusColor(reservation.status)} px-3 py-1 rounded-full font-medium`}>
                                {getStatusText(reservation.status)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-lg">{reservation.service_type}</p>
                            
                            {/* Détails du service */}
                            {formatServiceDetails(reservation.service_type, reservation.service_details) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {formatServiceDetails(reservation.service_type, reservation.service_details)?.map((detail, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="text-xs bg-primary/10 text-primary border-primary/20"
                                  >
                                    {detail}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Info className="h-4 w-4" />
                              <span>Voir détails</span>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">Adresse</div>
                                <div className="text-muted-foreground">{reservation.address}, {reservation.city}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Phone className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium">Téléphone</div>
                                <div className="text-muted-foreground">{reservation.client_phone}</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Mail className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">Email</div>
                                <div className="text-muted-foreground">{reservation.client_email}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Clock className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium">Durée</div>
                                <div className="text-muted-foreground">{reservation.duration_minutes} minutes</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center pt-4 border-t border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <span className="font-bold text-foreground text-lg">
                              {format(new Date(reservation.scheduled_date), 'EEEE dd MMMM yyyy', { locale: fr })} 
                            </span>
                            <span className="text-primary font-bold">à {reservation.scheduled_time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Vue calendrier */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Calendrier principal */}
            <div className="dashboard-card xl:col-span-2">
              <div className="flex items-center justify-between mb-6 p-4 border-b border-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Planning mensuel</h3>
                    <p className="text-muted-foreground">Cliquez sur une date pour voir le détail</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-primary/10 border-primary/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-bold min-w-[160px] text-center">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-primary/10 border-primary/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  locale={fr}
                  className="rounded-xl border border-primary/20 bg-gradient-to-br from-background to-primary/5 p-4 w-full"
                  components={{
                    Day: ({ date, ...props }) => {
                      const dayLoad = getDayLoad(date);
                      const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                      const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                      
                      return (
                        <button
                          {...props}
                          className={`
                            relative w-12 h-12 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center border-2 m-1
                            ${isSelected 
                              ? 'bg-primary text-white border-primary shadow-xl scale-110 z-10' 
                              : isToday 
                                ? 'border-primary text-primary bg-primary/10 hover:bg-primary/20'
                                : dayLoad > 0 
                                  ? 'border-primary/40 bg-primary/15 hover:bg-primary/25 text-primary font-bold' 
                                  : 'border-transparent hover:border-primary/30 hover:bg-primary/10'
                            }
                          `}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedDate(date);
                          }}
                        >
                          {format(date, 'd')}
                          {dayLoad > 0 && (
                            <div className={`absolute -top-1 -right-1 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white
                              ${isSelected ? 'bg-white text-primary' : 'bg-red-500 text-white'}
                            `}>
                              {dayLoad}
                            </div>
                          )}
                        </button>
                      );
                    },
                  }}
                />
              </div>
            </div>

            {/* Planning du jour sélectionné */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6 p-4 border-b border-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {selectedDate 
                        ? format(selectedDate, 'dd/MM/yyyy', { locale: fr })
                        : 'Sélectionnez une date'
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate && format(selectedDate, 'EEEE', { locale: fr })} • {selectedDateEvents.length} RDV
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarDays className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Journée libre</h4>
                      <p className="text-muted-foreground">
                        Aucune réservation prévue pour cette date
                      </p>
                    </div>
                  ) : (
                    selectedDateEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        className="card-elegant p-4 hover:shadow-lg transition-all duration-300 border border-primary/10 cursor-pointer group"
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center font-bold text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{event.client_name}</h4>
                              <p className="text-sm text-muted-foreground">{event.service_type}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(event.status)} px-2 py-1 rounded-full font-medium text-xs`}>
                            {getStatusText(event.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{event.time}</span>
                            <span className="text-muted-foreground">({event.duration_minutes} min)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-muted-foreground">{event.estimated_price} CHF</span>
                          </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity border-t border-border/50 pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Info className="h-4 w-4 mr-2" />
                            Voir les détails
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ReservationDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default Dashboard;