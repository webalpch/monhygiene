import React, { useState } from 'react';
import { useReservations, ReservationDetail } from '@/hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Euro, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { getMainServiceDisplay } from '@/utils/serviceNameFormatter';

const Dashboard = () => {
  const { 
    reservations, 
    isLoading, 
    error, 
    updateReservationStatus, 
    updatePaymentStatus, 
    deleteReservation,
    getReservationStats 
  } = useReservations();
  
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const stats = getReservationStats();

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

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    setUpdatingStatus(reservationId);
    const result = await updateReservationStatus(reservationId, newStatus);
    
    if (result.success) {
      toast.success('Statut mis à jour avec succès');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setUpdatingStatus(null);
  };

  const handlePaymentStatusUpdate = async (reservationId: string, newStatus: string) => {
    setUpdatingStatus(reservationId);
    const result = await updatePaymentStatus(reservationId, newStatus);
    
    if (result.success) {
      toast.success('Statut de paiement mis à jour');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setUpdatingStatus(null);
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;
    
    setUpdatingStatus(reservationId);
    const result = await deleteReservation(reservationId);
    
    if (result.success) {
      toast.success('Réservation supprimée');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setUpdatingStatus(null);
  };

  const filteredReservations = statusFilter === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === statusFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Gestion des réservations MonHygiène</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="w-8 h-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} CHF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les réservations</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reservation.client_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(reservation.scheduled_date), 'dd MMMM yyyy', { locale: fr })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {reservation.scheduled_time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {reservation.city}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(reservation.payment_status)}>
                          {reservation.payment_status}
                        </Badge>
                        {reservation.is_multi_service && (
                          <Badge variant="outline">
                            {reservation.total_services} services
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-primary">
                          {reservation.estimated_price.toFixed(2)} CHF
                        </span>
                        <span className="text-sm text-gray-600">
                          Service: {getMainServiceDisplay(reservation)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Status Update */}
                        <Select 
                          value={reservation.status} 
                          onValueChange={(value) => handleStatusUpdate(reservation.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="in_progress">En cours</SelectItem>
                            <SelectItem value="completed">Terminée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Payment Status Update */}
                        <Select 
                          value={reservation.payment_status} 
                          onValueChange={(value) => handlePaymentStatusUpdate(reservation.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="paid">Payé</SelectItem>
                            <SelectItem value="failed">Échec</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* View Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la réservation</DialogTitle>
                            </DialogHeader>
                            {selectedReservation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Informations client</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Nom:</strong> {selectedReservation.client_name}</p>
                                      <p className="flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        {selectedReservation.client_email}
                                      </p>
                                      <p className="flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        {selectedReservation.client_phone}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Adresse</h4>
                                    <div className="text-sm">
                                      <p>{selectedReservation.address}</p>
                                      <p>{selectedReservation.postcode} {selectedReservation.city}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {selectedReservation.services && selectedReservation.services.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Services demandés</h4>
                                    <div className="space-y-2">
                                      {selectedReservation.services.map((service, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded">
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">{service.service_name}</span>
                                            <span className="text-primary font-semibold">
                                              {service.estimated_price?.toFixed(2)} CHF
                                            </span>
                                          </div>
                                          {service.form_data && Object.keys(service.form_data).length > 0 && (
                                            <div className="mt-2 text-sm text-gray-600">
                                              <strong>Détails:</strong>
                                              <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(service.form_data, null, 2)}
                                              </pre>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(reservation.id)}
                          disabled={updatingStatus === reservation.id}
                        >
                          {updatingStatus === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune réservation trouvée
              </h3>
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? "Il n'y a encore aucune réservation." 
                  : `Aucune réservation avec le statut "${statusFilter}".`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;