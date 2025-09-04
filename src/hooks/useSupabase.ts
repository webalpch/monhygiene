import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Reservation, DashboardStats, CalendarEvent } from '@/types/database';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, signIn, signOut };
};

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('🔍 Données récupérées:', data);
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservation])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return { data: null, error };
    }
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating reservation:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return { reservations, loading, fetchReservations, createReservation, updateReservation };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_dashboard_stats');

      if (error) throw error;
      console.log('📊 Stats récupérées:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, fetchStats };
};

export const useCalendarEvents = (month: string, year: number) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('id, scheduled_date, scheduled_time, client_name, service_type, duration_minutes, status, estimated_price, final_price')
        .gte('scheduled_date', `${year}-${month.padStart(2, '0')}-01`)
        .lt('scheduled_date', `${year}-${(parseInt(month) + 1).toString().padStart(2, '0')}-01`)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      console.log('📅 Événements calendrier:', data);
      setEvents(data?.map(item => ({
        id: item.id,
        date: item.scheduled_date,
        time: item.scheduled_time,
        client_name: item.client_name,
        service_type: item.service_type,
        duration_minutes: item.duration_minutes,
        status: item.status,
        estimated_price: item.final_price || item.estimated_price
      })) || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [month, year]);

  return { events, loading, fetchEvents };
};