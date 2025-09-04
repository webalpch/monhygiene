import { useState, useEffect } from "react";
import { useReservations } from "@/hooks/useReservations";
import { ReservationCard } from "@/components/admin/ReservationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Clock, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminReservations() {
  const { 
    reservations, 
    isLoading, 
    updateReservationStatus, 
    updatePaymentStatus, 
    deleteReservation 
  } = useReservations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get tab from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'new';

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', newTab);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
  };

  // Categorize reservations
  const categorizeReservations = () => {
    const newReservations = reservations.filter(r => r.status === 'pending')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const confirmedReservations = reservations.filter(r => 
      r.status === 'confirmed' || r.status === 'in_progress' || r.status === 'completed'
    ).sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());

    return { newReservations, confirmedReservations };
  };

  const { newReservations, confirmedReservations } = categorizeReservations();

  // Filter function
  const filterReservations = (reservationList: typeof reservations) => {
    if (!searchTerm) return reservationList;
    return reservationList.filter(reservation =>
      reservation.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredNewReservations = filterReservations(newReservations);
  const filteredConfirmedReservations = filterReservations(confirmedReservations);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const result = await updateReservationStatus(id, status);
      if (result.success) {
        toast({
          title: "Succès",
          description: `Réservation ${status === 'confirmed' ? 'confirmée' : 'mise à jour'} avec succès`
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const result = await updatePaymentStatus(id, status);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Statut de paiement mis à jour"
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;
    
    setUpdatingId(id);
    try {
      const result = await deleteReservation(id);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Réservation supprimée"
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickConfirm = async (id: string) => {
    await handleStatusUpdate(id, 'confirmed');
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-3 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Gestion des Réservations
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gérez vos nouvelles réservations et suivez les confirmées
        </p>
      </div>

      {/* Search */}
      <Card className="mb-3 sm:mb-6 shadow-sm">
        <CardContent className="p-3 sm:pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher par nom, email, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for New/Confirmed reservations */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
          <TabsTrigger value="new" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:hidden">Nouv.</span>
            <span className="hidden sm:inline">Nouvelles</span>
            {filteredNewReservations.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-1 sm:px-2 py-0.5 text-xs min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 flex items-center justify-center">
                {filteredNewReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:hidden">Conf.</span>
            <span className="hidden sm:inline">Confirmées</span>
            <span className="text-xs opacity-70">({filteredConfirmedReservations.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b p-3 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                  <span>Nouvelles Réservations</span>
                </div>
                {filteredNewReservations.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:ml-auto">
                    {filteredNewReservations.length} en attente
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {filteredNewReservations.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Bell className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">Aucune nouvelle réservation</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">Les nouvelles réservations apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-6">
                  {filteredNewReservations.map((reservation) => (
                    <div key={reservation.id} className="relative bg-white border-2 border-orange-200 rounded-lg p-0.5 sm:p-1">
                      <ReservationCard
                        reservation={reservation}
                        onStatusUpdate={handleStatusUpdate}
                        onPaymentStatusUpdate={handlePaymentStatusUpdate}
                        onDelete={handleDelete}
                        isUpdating={updatingId === reservation.id}
                      />
                      
                      {/* Quick confirm button */}
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                        <Button
                          onClick={() => handleQuickConfirm(reservation.id)}
                          disabled={updatingId === reservation.id}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                          size="sm"
                        >
                          {updatingId === reservation.id ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                              <span className="hidden sm:inline">Confirmer</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed">
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b p-3 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  <span>Réservations Confirmées</span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:ml-auto">
                  {filteredConfirmedReservations.length} confirmée{filteredConfirmedReservations.length > 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {filteredConfirmedReservations.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">Aucune réservation confirmée</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">Les réservations confirmées s'afficheront ici</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredConfirmedReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onStatusUpdate={handleStatusUpdate}
                      onPaymentStatusUpdate={handlePaymentStatusUpdate}
                      onDelete={handleDelete}
                      isUpdating={updatingId === reservation.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}