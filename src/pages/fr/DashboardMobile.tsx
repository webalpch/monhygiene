import { useState, useMemo } from 'react';
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
  TrendingUp,
  LogOut,
  Eye,
  MapPin,
  Phone,
  Mail,
  Menu,
  Bell,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types/database';
import { formatServiceName } from '@/utils/serviceNameFormatter';

const DashboardMobile = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'calendar'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { user, signOut } = useAuth();
  const { reservations, loading: reservationsLoading } = useReservations();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    if (!reservations) return { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 };
    
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const revenue = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.estimated_price || 0), 0);

    return { total, pending, confirmed, completed, revenue };
  }, [reservations]);

  // Filtrage des réservations
  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    
    let filtered = reservations;
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.client_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
    );
  }, [reservations, statusFilter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'confirmed': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-emerald-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-500';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Mobile */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">MH</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">MonHygiène</h1>
              <p className="text-xs text-slate-600">Dashboard Pro</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="p-2">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
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
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Navigation Tabs Mobile */}
        <div className="flex border-t bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'overview' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-slate-600'
            }`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'reservations' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-slate-600'
            }`}
          >
            Réservations
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'calendar' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-slate-600'
            }`}
          >
            Planning
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Vue Aperçu */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Confirmées</p>
                      <p className="text-2xl font-bold text-emerald-900">{stats.confirmed}</p>
                    </div>
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">En attente</p>
                      <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
                    </div>
                    <div className="p-2 bg-amber-600 rounded-lg">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Revenus</p>
                      <p className="text-lg font-bold text-purple-900">{stats.revenue.toFixed(0)} CHF</p>
                    </div>
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dernières réservations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Dernières réservations
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('reservations')}
                  >
                    Voir tout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredReservations.slice(0, 3).map((reservation) => (
                  <div 
                    key={reservation.id}
                    onClick={() => handleReservationClick(reservation)}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg active:bg-slate-100 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{reservation.client_name}</p>
                      <p className="text-sm text-slate-600 truncate">{formatServiceName(reservation.service_type, reservation.service_details)}</p>
                      <p className="text-xs text-slate-500">
                        {format(parseISO(reservation.scheduled_date), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(reservation.status)}`}></div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Vue Réservations */}
        {activeTab === 'reservations' && (
          <>
            {/* Barre de recherche et filtres */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
                
                <Button variant="outline" size="sm" className="p-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liste des réservations */}
            <div className="space-y-3">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      onClick={() => handleReservationClick(reservation)}
                      className="p-4 active:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">{reservation.client_name}</h3>
                          <p className="text-sm text-slate-600 truncate">{formatServiceName(reservation.service_type, reservation.service_details)}</p>
                        </div>
                        <Badge 
                          className={`${getStatusColor(reservation.status)} text-white border-0 ml-2`}
                        >
                          {getStatusText(reservation.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                          <CalendarIcon className="h-4 w-4 mr-2 shrink-0" />
                          <span>{format(parseISO(reservation.scheduled_date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-2 shrink-0" />
                          <span>{reservation.scheduled_time}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 shrink-0" />
                          <span className="truncate">{reservation.city}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-emerald-600">
                            {reservation.estimated_price?.toFixed(2)} CHF
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredReservations.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500">Aucune réservation trouvée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Vue Planning */}
        {activeTab === 'calendar' && (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Planning</h3>
              <p className="text-slate-600 mb-4">Vue calendrier en développement</p>
              <Button onClick={() => setActiveTab('reservations')}>
                Voir les réservations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de détail */}
      <ReservationDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default DashboardMobile;