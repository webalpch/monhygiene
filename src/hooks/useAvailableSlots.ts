import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, addDays, isSunday, isToday } from 'date-fns';

export interface AvailableSlot {
  date: Date;
  period: 'morning' | 'afternoon';
  isAvailable: boolean;
}

export const useAvailableSlots = () => {
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnavailableSlots = async () => {
    setLoading(true);
    try {
      // Récupérer les créneaux déjà réservés pour les 30 prochains jours
      const today = new Date();
      const endDate = addDays(today, 30);
      
      const { data, error } = await supabase
        .from('reservations')
        .select('scheduled_date, scheduled_time')
        .gte('scheduled_date', format(today, 'yyyy-MM-dd'))
        .lte('scheduled_date', format(endDate, 'yyyy-MM-dd'))
        .neq('status', 'cancelled');

      if (error) throw error;

      // Créer un array des créneaux indisponibles au format "YYYY-MM-DD-period"
      const slots = data?.map(reservation => {
        const period = reservation.scheduled_time === '09:00' ? 'morning' : 'afternoon';
        return `${reservation.scheduled_date}-${period}`;
      }) || [];

      setUnavailableSlots(slots);
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si un créneau est disponible
  const isSlotAvailable = (date: Date, period: 'morning' | 'afternoon') => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slotKey = `${dateStr}-${period}`;
    return !unavailableSlots.includes(slotKey);
  };

  // Générer les créneaux disponibles pour les 14 prochains jours
  const getAvailableSlots = () => {
    const slots: AvailableSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Exclure les dimanches et aujourd'hui
      if (!isSunday(date) && !isToday(date)) {
        slots.push({
          date,
          period: 'morning',
          isAvailable: isSlotAvailable(date, 'morning')
        });
        
        slots.push({
          date,
          period: 'afternoon',
          isAvailable: isSlotAvailable(date, 'afternoon')
        });
      }
    }
    
    return slots;
  };

  useEffect(() => {
    fetchUnavailableSlots();
    
    // Actualiser les créneaux plus fréquemment (toutes les 10 secondes)
    const interval = setInterval(fetchUnavailableSlots, 10000);
    
    // Écouter les changements dans la table reservations en temps réel
    const channel = supabase
      .channel('reservation_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          console.log('🔄 Changement détecté dans les réservations:', payload);
          fetchUnavailableSlots();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    unavailableSlots,
    loading,
    isSlotAvailable,
    getAvailableSlots,
    refreshSlots: fetchUnavailableSlots
  };
};