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
      // Utiliser la vue reservation_details qui joint automatiquement les services
      const { data, error: fetchError } = await supabase
        .from('reservation_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setReservations(data || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error(err);
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

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue
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