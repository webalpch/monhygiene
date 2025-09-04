import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export interface AdminScheduleSlot {
  id?: string;
  date: string;
  period: 'morning' | 'afternoon';
  is_available: boolean;
  created_at?: string;
}

export const useAdminSchedule = () => {
  const [adminSchedule, setAdminSchedule] = useState<AdminScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminSchedule = async () => {
    setLoading(true);
    try {
      console.log('🔧 Fetching admin schedule...');
      const { data, error } = await supabase
        .from('admin_schedule')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('❌ Erreur Supabase admin_schedule:', error);
        throw error;
      }
      
      console.log('✅ Admin schedule loaded:', data?.length || 0, 'slots');
      console.log('📅 Admin schedule data:', data);
      setAdminSchedule(data || []);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du planning admin:', error);
      // Continue with empty schedule if table doesn't exist
      setAdminSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if a specific slot is available according to admin schedule
  const isSlotAvailableByAdmin = (date: Date, period: 'morning' | 'afternoon') => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const adminSlot = adminSchedule.find(s => s.date === dateStr && s.period === period);
    
    console.log(`🔍 Admin check for ${dateStr}-${period}:`, {
      adminSlot,
      totalAdminSlots: adminSchedule.length,
      result: adminSlot ? adminSlot.is_available : true
    });
    
    // If no admin setting exists, default to available
    // If admin setting exists, use its availability
    return adminSlot ? adminSlot.is_available : true;
  };

  useEffect(() => {
    fetchAdminSchedule();
  }, []);

  return {
    adminSchedule,
    loading,
    fetchAdminSchedule,
    isSlotAvailableByAdmin
  };
};