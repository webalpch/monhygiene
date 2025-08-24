import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth, useReservations } from '@/hooks/useSupabase';
import { ReservationDetailModal } from '@/components/ReservationDetailModal';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  LogOut,
  Eye,
  MapPin,
  Menu,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types/database';
import { formatServiceName } from '@/utils/serviceNameFormatter';

const Dashboard = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { user, signOut } = useAuth();
  const { reservations, loading: reservationsLoading } = useReservations();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Horloge temps réel pour Sion
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSionTime = () => {
    return new Intl.DateTimeFormat('fr-CH', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(currentTime);
  };

  // Fonctions calendrier
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Générer les jours du calendrier
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Grouper les réservations par date
  const reservationsByDate = useMemo(() => {
    if (!reservations) return {};
    
    return reservations.reduce((acc, reservation) => {
      const dateKey = format(parseISO(reservation.scheduled_date), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(reservation);
      return acc;
    }, {} as Record<string, Reservation[]>);
  }, [reservations]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate('/fr/login');
    }
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  // Statistiques
  const stats = useMemo(() => {
    if (!reservations) return { total: 0, confirmed: 0 };
    
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;

    return { total, confirmed };
  }, [reservations]);

  // Filtrage des réservations
  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    
    let filtered = reservations;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.client_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Trier par date et heure la plus proche en premier
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
      const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [reservations, statusFilter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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

  if (reservationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header responsive */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-sm lg:text-xl font-bold text-white">MH</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                  MonHygiène Pro
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 font-medium">Bienvenue, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="outline" size="sm" className="p-2">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2 lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">{user?.email}</p>
                      <p className="text-sm text-slate-600">Administrateur</p>
                    </div>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      className="w-full justify-start text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="hidden lg:block">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="hover:bg-red-50 hover:text-red-600 px-4 lg:px-6"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Stats Cards avec horloge */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-bold text-blue-700">Total</p>
                  <p className="text-xl lg:text-3xl font-black text-blue-900">{stats.total}</p>
                </div>
                <div className="p-1.5 lg:p-2 bg-blue-600 rounded-lg">
                  <CalendarIcon className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-bold text-emerald-700">Confirmées</p>
                  <p className="text-xl lg:text-3xl font-black text-emerald-900">{stats.confirmed}</p>
                </div>
                <div className="p-1.5 lg:p-2 bg-emerald-600 rounded-lg">
                  <Users className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horloge Sion */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-bold text-purple-700">Heure à Sion</p>
                  <p className="text-lg lg:text-2xl font-black text-purple-900">{getSionTime()}</p>
                </div>
                <div className="p-1.5 lg:p-2 bg-purple-600 rounded-lg">
                  <Clock className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Vue */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <Button
              variant={activeView === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setActiveView('calendar')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeView === 'calendar' 
                  ? 'bg-white shadow-md text-blue-700 font-bold' 
                  : 'text-slate-600'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendrier
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'ghost'}
              onClick={() => setActiveView('list')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeView === 'list' 
                  ? 'bg-white shadow-md text-blue-700 font-bold' 
                  : 'text-slate-600'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Liste
            </Button>
          </div>
        </div>

        {/* Vue Calendrier */}
        {activeView === 'calendar' ? (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3 lg:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 lg:p-6">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="text-center text-xs lg:text-sm font-medium text-slate-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1 lg:gap-2">
                {calendarDays.map((day, index) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayReservations = reservationsByDate[dateKey] || [];
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] lg:min-h-[120px] p-1 lg:p-2 border border-slate-200 rounded-lg ${
                        isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                      } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                    >
                      <div className={`text-xs lg:text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                      } ${isToday ? 'text-blue-700 font-bold' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayReservations.slice(0, 2).map((reservation) => {
                          const hour = parseInt(reservation.scheduled_time.split(':')[0]);
                          const isAfternoon = hour >= 12;
                          
                          return (
                            <div
                              key={reservation.id}
                              onClick={() => handleReservationClick(reservation)}
                              className={`p-1 text-xs rounded cursor-pointer hover:shadow-sm transition-all ${
                                isAfternoon 
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                                  : 'bg-blue-100 text-blue-800 border-blue-200'
                              }`}
                            >
                              <div className="font-medium truncate">{reservation.client_name}</div>
                              <div className="truncate opacity-75">
                                {formatServiceName(reservation.service_type, reservation.service_details)}
                              </div>
                            </div>
                          );
                        })}
                        {dayReservations.length > 2 && (
                          <div className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                            +{dayReservations.length - 2} autres
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Vue Liste */
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3 lg:pb-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <CardTitle className="text-lg lg:text-2xl font-bold text-slate-800">
                    Liste des Réservations
                  </CardTitle>
                  <p className="text-sm lg:text-base text-slate-600">
                    {filteredReservations.length} réservation(s) trouvée(s)
                  </p>
                </div>
                
                {/* Contrôles responsive */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmées</option>
                    <option value="completed">Terminées</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 lg:space-y-4">
              {filteredReservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  onClick={() => handleReservationClick(reservation)}
                  className="bg-white border border-slate-200 rounded-lg p-4 lg:p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-slate-900 truncate">
                            {reservation.client_name}
                          </h3>
                          <div className="text-sm lg:text-base text-blue-700 font-medium truncate mb-1">
                            {formatServiceName(reservation.service_type, reservation.service_details)}
                          </div>
                          {/* Affichage détaillé des options */}
                          {reservation.service_details && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {reservation.service_details.pack && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  Pack {reservation.service_details.pack}
                                </Badge>
                              )}
                              {reservation.service_details.numberOfSeats && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  {reservation.service_details.numberOfSeats} places
                                </Badge>
                              )}
                              {reservation.service_details.matressSize && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {reservation.service_details.matressSize}cm
                                </Badge>
                              )}
                              {reservation.service_details.numberOfRooms && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  {reservation.service_details.numberOfRooms} pièces
                                </Badge>
                              )}
                              {reservation.service_details.surface && (
                                <Badge className="bg-cyan-100 text-cyan-800 text-xs">
                                  {reservation.service_details.surface}m²
                                </Badge>
                              )}
                              {reservation.service_details.surfaceType && (
                                <Badge className="bg-teal-100 text-teal-800 text-xs">
                                  {reservation.service_details.surfaceType}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(reservation.status)} mt-2 sm:mt-0 sm:ml-4 self-start text-xs`}>
                          {getStatusText(reservation.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-xs lg:text-sm text-slate-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 shrink-0" />
                          <span className="truncate">
                            {format(parseISO(reservation.scheduled_date), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 shrink-0" />
                          <span>{reservation.scheduled_time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 shrink-0" />
                          <span className="truncate">{reservation.city}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between lg:justify-end lg:ml-6 space-x-4">
                      <span className="text-base lg:text-xl font-bold text-emerald-600">
                        {reservation.estimated_price?.toFixed(2)} CHF
                      </span>
                      <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                        <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="hidden sm:inline">Voir</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReservations.length === 0 && (
                <div className="text-center py-8 lg:py-12">
                  <Search className="h-12 w-12 lg:h-16 lg:w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-2">Aucune réservation trouvée</h3>
                  <p className="text-sm lg:text-base text-slate-600">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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