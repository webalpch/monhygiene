import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types/database';

export interface Notification {
  id: string;
  reservationId: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  reservation: Reservation;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Écouter les nouvelles réservations en temps réel
    const channel = supabase
      .channel('reservations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations',
        },
        (payload) => {
          const newReservation = payload.new as Reservation;
          const newNotification: Notification = {
            id: `notif-${newReservation.id}`,
            reservationId: newReservation.id,
            message: `Nouvelle réservation de ${newReservation.client_name}`,
            isRead: false,
            timestamp: new Date().toISOString(),
            reservation: newReservation,
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };
};