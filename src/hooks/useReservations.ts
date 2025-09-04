import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export interface ReservationDetail {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  city: string;
  postcode: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  estimated_price: number;
  status: string;
  payment_status: string;
  is_multi_service: boolean;
  total_services: number;
  notes?: string;
  created_at: string;
  services: Array<{
    service_id: string;
    service_name: string;
    service_icon: string;
    form_data: any;
    estimated_price: number;
  }>;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<ReservationDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer d'abord les réservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (reservationsError) {
        setError(reservationsError.message);
        console.error('Erreur lors du chargement des réservations:', reservationsError);
        return;
      }

      // Puis extraire les services depuis service_details pour chaque réservation
      const reservationsWithServices = (reservationsData || []).map((reservation) => {
        let services: any[] = [];
        
        // Extraire les services depuis service_details
        if (reservation.service_details && reservation.service_details.services) {
          services = reservation.service_details.services.map((service: any) => ({
            service_id: service.id,
            service_name: service.name,
            service_icon: '',
            form_data: service.formData || {},
            estimated_price: service.estimatedPrice || 0
          }));
        }

        return {
          ...reservation,
          services: services,
          // Calculer les totaux à partir des services
          total_services: services.length,
          is_multi_service: services.length > 1
        };
      });

      console.log('Réservations avec services chargées:', reservationsWithServices);
      setReservations(reservationsWithServices);

    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error('Erreur générale:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    if (!supabase) return { success: false, error: 'Supabase non initialisé' };

    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour l'état local
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status }
            : res
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  const updatePaymentStatus = async (reservationId: string, paymentStatus: string) => {
    if (!supabase) return { success: false, error: 'Supabase non initialisé' };

    try {
      const { error } = await supabase
        .from('reservations')
        .update({ payment_status: paymentStatus })
        .eq('id', reservationId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour l'état local
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, payment_status: paymentStatus }
            : res
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (!supabase) return { success: false, error: 'Supabase non initialisé' };

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour l'état local
      setReservations(prev => prev.filter(res => res.id !== reservationId));

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };

  const getReservationById = (id: string) => {
    return reservations.find(res => res.id === id);
  };

  const getReservationsByStatus = (status: string) => {
    return reservations.filter(res => res.status === status);
  };

  const getReservationStats = () => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    const totalRevenue = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.estimated_price || 0), 0);

    // Revenus du mois en cours
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = reservations
      .filter(r => {
        const resDate = new Date(r.created_at);
        return r.status === 'completed' && 
               resDate.getMonth() === currentMonth && 
               resDate.getFullYear() === currentYear;
      })
      .reduce((sum, r) => sum + (r.estimated_price || 0), 0);

    // Prix moyen
    const averagePrice = completed > 0 ? totalRevenue / completed : 0;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
      monthlyRevenue,
      averagePrice
    };
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    isLoading,
    error,
    fetchReservations,
    updateReservationStatus,
    updatePaymentStatus,
    deleteReservation,
    getReservationById,
    getReservationsByStatus,
    getReservationStats
  };
};